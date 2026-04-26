import React, { useState, useEffect } from 'react';

/**
 * Simple pathname-based router for client-side navigation
 * Routes: /, /pharmacies, /medicines, /about
 */
const useRouter = () => {
  const [currentPage, setCurrentPage] = useState(window.location.pathname || '/');

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(window.location.pathname || '/');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return currentPage;
};

export default useRouter;
