import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-terracotta">404</p>
      <h1 className="mt-4 font-sans text-2xl font-bold text-ink">Page not found</h1>
      <p className="mt-2 text-ink/60">
        The page you’re looking for doesn’t exist or may have moved.
      </p>
      <Button asChild className="mt-6 rounded-full">
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
}
