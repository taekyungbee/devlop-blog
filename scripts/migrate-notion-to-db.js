require('dotenv').config();
const { Pool } = require('pg');

const NOTION_API_KEY = process.env.NOTION_TRENDS_API_KEY;
const NOTION_DB_ID = process.env.NOTION_TRENDS_DB_ID;

// DB 연결
const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function fetchAllNotionData() {
  let allResults = [];
  let hasMore = true;
  let startCursor = undefined;

  while (hasMore) {
    const response = await fetch(`https://api.notion.com/v1/databases/${NOTION_DB_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        start_cursor: startCursor,
        page_size: 100,
      }),
    });

    const data = await response.json();
    if (data.error) throw new Error(JSON.stringify(data.error));

    allResults = allResults.concat(data.results);
    hasMore = data.has_more;
    startCursor = data.next_cursor;
    process.stdout.write(`\rFetching from Notion: ${allResults.length} records`);
  }
  console.log();
  return allResults;
}

function extractProperty(props, name, type) {
  const prop = props[name];
  if (!prop) return null;

  switch (type) {
    case 'title':
      return prop.title?.[0]?.plain_text || null;
    case 'rich_text':
      return prop.rich_text?.[0]?.plain_text || null;
    case 'url':
      return prop.url || null;
    case 'date':
      return prop.date?.start || null;
    case 'created_time':
      return prop.created_time || null;
    case 'select':
      return prop.select?.name || null;
    default:
      return null;
  }
}

async function migrateData() {
  console.log('1. Fetching data from Notion...');
  const notionData = await fetchAllNotionData();

  console.log(`2. Transforming ${notionData.length} records...`);
  const videos = notionData.map(page => {
    const props = page.properties;
    return {
      title: extractProperty(props, 'Title', 'title'),
      link: extractProperty(props, 'Link', 'url'),
      pubDate: extractProperty(props, 'PubDate', 'date'),
      source: extractProperty(props, 'Source', 'select'),
      summary: extractProperty(props, 'Summary', 'rich_text'),
      createdAt: extractProperty(props, 'CreatedAt', 'created_time'),
    };
  }).filter(v => v.title && v.link && v.pubDate);

  console.log(`   Valid records: ${videos.length}`);

  console.log('3. Inserting into PostgreSQL...');
  let inserted = 0;
  let skipped = 0;

  for (const video of videos) {
    try {
      const result = await pool.query(`
        INSERT INTO trend_videos (title, link, pub_date, source, summary, created_at)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (link) DO NOTHING
        RETURNING id
      `, [
        video.title,
        video.link,
        video.pubDate,
        video.source || 'Unknown',
        video.summary,
        video.createdAt || new Date().toISOString(),
      ]);
      if (result.rowCount > 0) {
        inserted++;
      } else {
        skipped++;
      }
    } catch (err) {
      skipped++;
      if (skipped <= 5) console.log(`\n   Error: ${err.message.substring(0, 100)}`);
    }

    if (inserted % 100 === 0) {
      process.stdout.write(`\r   Inserted: ${inserted} / ${videos.length}`);
    }
  }

  console.log(`\n\n✅ Complete!`);
  console.log(`   Inserted: ${inserted}`);
  console.log(`   Skipped: ${skipped}`);

  // Verify
  const count = await pool.query('SELECT COUNT(*) FROM trend_videos');
  console.log(`   Total in DB: ${count.rows[0].count}`);

  await pool.end();
}

migrateData().catch(err => {
  console.error('Error:', err);
  pool.end();
});
