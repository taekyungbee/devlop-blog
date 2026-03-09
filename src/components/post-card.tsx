import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { cn } from "@/lib/utils";

const categoryConfig: Record<string, { label: string; className: string }> = {
  ai: {
    label: "AI",
    className: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  },
  backend: {
    label: "Backend",
    className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  frontend: {
    label: "Frontend",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  devops: {
    label: "DevOps",
    className: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  },
  project: {
    label: "Project",
    className: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  },
};

interface PostCardProps {
  slug: string;
  title: string;
  description?: string | null;
  date: string;
  category?: string;
  tags?: string[];
}

export function PostCard({
  slug,
  title,
  description,
  date,
  category,
  tags,
}: PostCardProps) {
  const categoryInfo = category ? categoryConfig[category] : null;

  return (
    <Card className="h-full overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/20 bg-background/60 backdrop-blur-md border-muted/50 hover:border-primary/50">
      <Link href={`/${slug}`}>
        <CardHeader>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <time dateTime={date}>{formatDate(date)}</time>
            {categoryInfo && (
              <Badge className={cn("text-xs font-medium", categoryInfo.className)}>
                {categoryInfo.label}
              </Badge>
            )}
          </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          {description && (
            <CardDescription className="text-base">{description}</CardDescription>
          )}
        </CardHeader>
        {tags && tags.length > 0 && (
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-secondary/50 hover:bg-secondary/80 transition-colors">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        )}
      </Link>
    </Card>
  );
}
