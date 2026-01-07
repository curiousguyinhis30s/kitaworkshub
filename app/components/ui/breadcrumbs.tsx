import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="flex">
      <ol className="flex flex-wrap items-center gap-1.5 break-words text-sm text-gray-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-1.5">
              {!isLast && item.href ? (
                <>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-primary-600"
                  >
                    {item.label}
                  </Link>
                  <ChevronRight className="h-4 w-4 text-gray-400" aria-hidden="true" />
                </>
              ) : (
                <span className="font-medium text-gray-900">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
