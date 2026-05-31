import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

// Fixed page order for navigation
const PAGE_ORDER = [
  '/',
  '/about',
  '/pharmacies',
  '/medicines',
  '/login',
  '/register',
];

const BackButton = () => {
  const currentPath = window.location.pathname;

  // Don't show on the landing/home page
  if (currentPath === '/') return null;

  const currentIndex = PAGE_ORDER.indexOf(currentPath);

  const prevPage = currentIndex > 0 ? PAGE_ORDER[currentIndex - 1] : null;
  const nextPage = currentIndex < PAGE_ORDER.length - 1 ? PAGE_ORDER[currentIndex + 1] : null;

  const goBack = () => {
    if (prevPage) {
      window.location.href = prevPage;
    } else if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  };

  const goNext = () => {
    if (nextPage) {
      window.location.href = nextPage;
    }
  };

  return (
    <>
      {/* Back button - middle left edge */}
      <button
        type="button"
        onClick={goBack}
        aria-label="Go back"
        className="fixed left-2 top-1/2 -translate-y-1/2 z-[90] bg-transparent border-none shadow-none p-1 text-emerald-500 hover:text-emerald-300 transition-colors duration-200"
      >
        <ArrowLeft size={28} strokeWidth={2.5} />
      </button>

      {/* Next button - middle right edge — only show if there's a next page */}
      {nextPage && (
        <button
          type="button"
          onClick={goNext}
          aria-label="Go forward"
          className="fixed right-2 top-1/2 -translate-y-1/2 z-[90] bg-transparent border-none shadow-none p-1 text-emerald-500 hover:text-emerald-300 transition-colors duration-200"
        >
          <ArrowRight size={28} strokeWidth={2.5} />
        </button>
      )}
    </>
  );
};

export default BackButton;
