import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PostCardProps {
  slug: string;
  title: string;
  description?: string;
  date: string;
  tags?: string[];
}

export function PostCard({
  slug,
  title,
  description,
  date,
  tags,
}: PostCardProps) {
  return (
    <Card className="h-full overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/20 bg-background/60 backdrop-blur-md border-muted/50 hover:border-primary/50">
      <Link href={`/${slug}`}>
        <CardHeader>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <time dateTime={date}>{formatDate(date)}</time>
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
