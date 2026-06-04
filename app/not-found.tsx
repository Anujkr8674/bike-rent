import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mesh-bg flex min-h-[70vh] flex-col items-center justify-center px-4 py-20 text-center">
      <p className="font-display text-8xl font-bold gradient-text">404</p>
      <h1 className="mt-4 font-display text-3xl font-bold text-zinc-900">Page not found</h1>
      <p className="mt-3 max-w-md text-zinc-600">
        The page you're looking for doesn't exist or has moved. Let's get you back on the road in Ranchi.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link href="/">
          <Button className="gap-2">
            <Home className="h-4 w-4" />
            Home
          </Button>
        </Link>
        <Link href="/bikes">
          <Button variant="outline" className="gap-2">
            <Search className="h-4 w-4" />
            Browse bikes
          </Button>
        </Link>
      </div>
    </div>
  );
}
