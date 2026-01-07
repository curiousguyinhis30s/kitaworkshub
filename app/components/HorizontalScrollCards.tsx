"use client";

import { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CardItem {
  id: number | string;
  title: string;
  type?: string;
  date?: string;
  month?: string;
  time?: string;
  location?: string;
  subtitle?: string;
  featured?: boolean;
}

interface HorizontalScrollCardsProps {
  items: CardItem[];
  title?: string;
  viewAllHref?: string;
  onViewAll?: () => void;
  renderCard?: (item: CardItem, isFeatured: boolean) => React.ReactNode;
}

export default function HorizontalScrollCards({
  items,
  title,
  viewAllHref,
  onViewAll,
  renderCard,
}: HorizontalScrollCardsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Sort: featured first
  const sortedItems = [...items].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  const checkScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  useEffect(() => {
    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      checkScroll();
      return () => {
        ref.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [checkScroll, sortedItems]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollTo({
        left: scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount),
        behavior: 'smooth'
      });
    }
  };

  const DefaultCard = ({ item, isFeatured }: { item: CardItem; isFeatured: boolean }) => (
    <div className={`flex-shrink-0 w-[85vw] sm:w-[45vw] lg:w-[30vw] xl:w-[22vw] snap-start bg-white rounded-xl border overflow-hidden transition-all duration-300 hover:shadow-lg ${
      isFeatured ? 'border-accent-300 ring-1 ring-accent-200' : 'border-gray-200'
    }`}>
      {/* Date Badge Header */}
      {item.date && (
        <div className="h-20 bg-gradient-to-br from-primary-700 to-primary-800 flex items-center justify-between px-5">
          <div className="flex items-center gap-4">
            <div className="text-center text-white">
              <div className="text-2xl font-bold leading-none">{item.date}</div>
              <div className="text-xs uppercase text-white/90">{item.month}</div>
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm leading-tight line-clamp-2">{item.title}</h3>
            </div>
          </div>
          {item.type && (
            <span className="px-2 py-1 bg-white/30 text-white rounded text-xs font-medium">
              {item.type}
            </span>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {!item.date && (
          <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
        )}
        {item.subtitle && (
          <p className="text-sm text-gray-500 mb-3">{item.subtitle}</p>
        )}
        {item.time && (
          <p className="text-xs text-gray-500 mb-1">{item.time}</p>
        )}
        {item.location && (
          <p className="text-xs text-gray-500">{item.location}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="relative group">
      {/* Header */}
      {(title || viewAllHref || onViewAll) && (
        <div className="flex justify-between items-center mb-4 px-1">
          {title && <h2 className="text-xl font-bold text-gray-900">{title}</h2>}
          {(viewAllHref || onViewAll) && (
            <button
              onClick={onViewAll}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              aria-label={`View all ${title || 'items'}`}
            >
              View All →
            </button>
          )}
        </div>
      )}

      {/* Scroll Container */}
      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-lg border border-gray-200 text-gray-600 hover:text-primary-600 transition-all duration-200 ${
            canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          aria-label="Scroll Left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Cards Row */}
        <div
          ref={scrollRef}
          role="region"
          aria-label={title ? `${title} carousel` : 'Scrollable cards'}
          tabIndex={0}
          className="flex gap-4 overflow-x-auto pb-4 pt-1 px-1 snap-x snap-mandatory scrollbar-hide focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {sortedItems.map((item) => (
            renderCard ? (
              <div key={item.id} className="flex-shrink-0 w-[85vw] sm:w-[45vw] lg:w-[30vw] xl:w-[22vw] snap-start">
                {renderCard(item, !!item.featured)}
              </div>
            ) : (
              <DefaultCard key={item.id} item={item} isFeatured={!!item.featured} />
            )
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-lg border border-gray-200 text-gray-600 hover:text-primary-600 transition-all duration-200 ${
            canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          aria-label="Scroll Right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Hide scrollbar globally */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
