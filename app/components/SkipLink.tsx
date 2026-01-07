"use client";

export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="
        sr-only
        focus:not-sr-only
        focus:absolute
        focus:top-4
        focus:left-4
        focus:z-[100]
        focus:px-4
        focus:py-3
        focus:bg-primary-700
        focus:text-white
        focus:rounded-lg
        focus:font-semibold
        focus:shadow-lg
        focus:outline-none
        focus:ring-2
        focus:ring-offset-2
        focus:ring-primary-500
        transition-all
      "
    >
      Skip to main content
    </a>
  );
}
