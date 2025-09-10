'use client';

import { useEffect, useRef, useState } from 'react';

type Props = {
  children: React.ReactNode;
  /** Put the chip at the bottom. No spacer, can’t cover the page. */
  bottom?: number; // px from bottom
  /** Extra classes for inner card */
  innerClassName?: string;
};

export default function SmartRevealBar({
  children,
  bottom = 16, // 16px from bottom
  innerClassName = '',
}: Props) {
  // optional: show/hide on scroll-up if you still want that behavior
  const [hidden, setHidden] = useState(false);
  const lastYRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const diff = y - lastYRef.current;
      // hide while scrolling down, show on scroll up
      if (Math.abs(diff) > 4) setHidden(diff > 0 && y > 80);
      lastYRef.current = y < 0 ? 0 : y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={[
        // Bottom-floating, centered chip. Doesn’t block layout or cover the page.
        'pointer-events-none fixed left-1/2 z-30 -translate-x-1/2 transition-transform duration-300',
        hidden ? 'translate-y-[150%]' : 'translate-y-0',
      ].join(' ')}
      style={{ bottom }}
    >
      <div className="pointer-events-auto mx-auto w-full max-w-md px-4">
        <div
          className={[
            'rounded-2xl border bg-white/90 px-3 py-2 backdrop-blur supports-[backdrop-filter]:bg-white/70 shadow-md ring-1 ring-black/10',
            innerClassName,
          ].join(' ')}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
