import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

// Ensure data directory exists
const dbDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, "trends.db");
const db = new Database(dbPath);

// Initialize Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS videos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    link TEXT NOT NULL UNIQUE,
    pubDate TEXT NOT NULL,
    source TEXT NOT NULL,
    thumbnail TEXT
  );

  CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    link TEXT NOT NULL UNIQUE,
    pubDate TEXT NOT NULL,
    source TEXT NOT NULL
  );
`);

export interface DbTrendItem {
    title: string;
    link: string;
    pubDate: string;
    source: string;
    thumbnail?: string;
}

export function saveVideos(videos: DbTrendItem[]) {
    const insert = db.prepare(`
        INSERT OR IGNORE INTO videos (title, link, pubDate, source, thumbnail)
        VALUES (@title, @link, @pubDate, @source, @thumbnail)
    `);

    const update = db.prepare(`
        UPDATE videos SET pubDate = @pubDate, source = @source, thumbnail = @thumbnail
        WHERE link = @link
    `);

    const deleteOld = db.prepare(`
        DELETE FROM videos WHERE id NOT IN (
            SELECT id FROM videos ORDER BY pubDate DESC LIMIT 50
        )
    `); // Keep only latest 50

    const transaction = db.transaction((items: DbTrendItem[]) => {
        for (const item of items) {
            const info = insert.run(item);
            if (info.changes === 0) {
                update.run(item);
            }
        }
        deleteOld.run();
    });

    transaction(videos);
}

export function saveNews(newsItems: DbTrendItem[]) {
    const insert = db.prepare(`
        INSERT OR IGNORE INTO news (title, link, pubDate, source)
        VALUES (@title, @link, @pubDate, @source)
    `);

    const update = db.prepare(`
        UPDATE news SET pubDate = @pubDate, source = @source
        WHERE link = @link
    `);

    const deleteOld = db.prepare(`
        DELETE FROM news WHERE id NOT IN (
            SELECT id FROM news ORDER BY pubDate DESC LIMIT 50
        )
    `);

    const transaction = db.transaction((items: DbTrendItem[]) => {
        for (const item of items) {
            const info = insert.run(item);
            if (info.changes === 0) {
                update.run(item);
            }
        }
        deleteOld.run();
    });

    transaction(newsItems);
}

export function getVideosFromDb(limit = 10): DbTrendItem[] {
    const stmt = db.prepare("SELECT title, link, pubDate, source, thumbnail FROM videos ORDER BY pubDate DESC LIMIT ?");
    return stmt.all(limit) as DbTrendItem[];
}

export function getNewsFromDb(limit = 10): DbTrendItem[] {
    const stmt = db.prepare("SELECT title, link, pubDate, source FROM news ORDER BY pubDate DESC LIMIT ?");
    return stmt.all(limit) as DbTrendItem[];
}
