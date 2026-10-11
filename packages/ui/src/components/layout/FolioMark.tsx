import React from 'react';

/** Two folded research pages. Decorative only; all brand text stays outside. */
export const FolioMark: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false">
    <path d="M8 25H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h15v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity=".5" />
    <path d="M12 7h10l6 6v14a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" fill="currentColor" fillOpacity=".08" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M22 7v6h6M15 19h8M15 23h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
