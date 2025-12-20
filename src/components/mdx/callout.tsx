import { cn } from "@/lib/utils";

interface CalloutProps {
  children?: React.ReactNode;
  type?: "default" | "warning" | "danger" | "info";
}

export function Callout({ children, type = "default" }: CalloutProps) {
  return (
    <div
      className={cn(
        "my-6 flex items-start rounded-md border border-l-4 p-4",
        {
          "border-l-blue-500 bg-blue-50 dark:bg-blue-950": type === "info",
          "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950":
            type === "warning",
          "border-l-red-500 bg-red-50 dark:bg-red-950": type === "danger",
          "border-l-gray-500 bg-gray-50 dark:bg-gray-950": type === "default",
        }
      )}
    >
      <div>{children}</div>
    </div>
  );
}
