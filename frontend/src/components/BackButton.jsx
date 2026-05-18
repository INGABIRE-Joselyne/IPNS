import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const BackButton = () => {
  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    window.location.href = '/';
  };

  const goNext = () => {
    window.history.forward();
  };

  return (
    <>
      <button
        type="button"
        onClick={goBack}
        aria-label="Go back"
        className="fixed left-5 top-5 z-[100] inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-blue-700 bg-blue-600 px-4 text-sm font-semibold text-white shadow-md transition-colors hover:bg-blue-700"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <button
        type="button"
        onClick={goNext}
        aria-label="Go next"
        className="fixed right-5 top-5 z-[100] inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-blue-700 bg-blue-600 px-4 text-sm font-semibold text-white shadow-md transition-colors hover:bg-blue-700"
      >
        Next
        <ArrowRight size={20} />
      </button>
    </>
  );
};

export default BackButton;
