import Link from "next/link";
import { Search, Home, MapPin } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md text-center">
        {/* Illustration */}
        <div className="mb-6 flex justify-center">
          <div className="relative flex h-40 w-40 items-center justify-center rounded-full bg-primary-100">
            <MapPin className="h-20 w-20 text-primary-700" />
            <div className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary-700 text-white shadow-lg">
              <span className="text-xl font-bold">?</span>
            </div>
          </div>
        </div>

        <h1 className="text-5xl font-extrabold text-gray-900">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-gray-800">
          Page not found
        </h2>
        <p className="mt-4 text-base text-gray-600">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center rounded-lg bg-primary-700 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
          >
            <Home className="mr-2 h-5 w-5" />
            Go Home
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
          >
            <Search className="mr-2 h-5 w-5" />
            Contact Us
          </Link>
        </div>

        {/* Popular Pages */}
        <div className="mt-10 border-t border-gray-200 pt-6">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Popular Pages
          </p>
          <ul className="mt-4 space-y-2">
            {[
              { name: "Courses", href: "/courses" },
              { name: "Services", href: "/services" },
              { name: "Events", href: "/events" },
              { name: "Community", href: "/community" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-base font-medium text-primary-700 hover:text-primary-800 hover:underline"
                >
                  {link.name} &rarr;
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
