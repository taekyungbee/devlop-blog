export function SiteBlob() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-[100px] animate-pulse mix-blend-multiply dark:mix-blend-screen filter opacity-50" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-500/30 rounded-full blur-[100px] animate-pulse delay-1000 mix-blend-multiply dark:mix-blend-screen filter opacity-50" />
      <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-blue-500/30 rounded-full blur-[100px] animate-pulse delay-2000 mix-blend-multiply dark:mix-blend-screen filter opacity-50" />
    </div>
  );
}
