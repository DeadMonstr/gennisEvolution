import { useEffect, useLayoutEffect } from "react";

/**
 * Hook to cache and restore scroll position.
 * @param key unique key for each route/page (e.g. "users-list")
 * @param element optional scrollable element (defaults to window)
 */
export function useScrollCache(key, element) {
    // Restore scroll when component mounts
    useLayoutEffect(() => {
        const raw = localStorage.getItem(`scroll:${key}`);
        const y = raw ? parseInt(raw, 10) : 0;
        if (element) {
            element.scrollTo({ top: y });
        } else {
            window.scrollTo({ top: y });
        }
    }, [key, element]);

    // Save scroll position on scroll
    useEffect(() => {
        const target = element ?? window;
        const handler = () => {
            const pos = element ? element.scrollTop : window.scrollY;
            localStorage.setItem(`scroll:${key}`, String(pos));
        };

        target.addEventListener("scroll", handler, { passive: true });
        return () => target.removeEventListener("scroll", handler);
    }, [key, element]);
}
