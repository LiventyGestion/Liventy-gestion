import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

interface ScrollPosition {
  x: number;
  y: number;
}

const scrollPositions: Record<string, ScrollPosition> = {};

export const useScrollRestoration = () => {
  const location = useLocation();
  const isRestoringRef = useRef(false);

  useEffect(() => {
    // Disable browser's default scroll restoration
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    const currentPath = location.pathname + location.search + location.hash;
    
    // Save current scroll position before navigation
    const saveScrollPosition = () => {
      const currentPos = {
        x: window.scrollX,
        y: window.scrollY
      };
      
      // Store position for current path
      const pathKey = sessionStorage.getItem("currentPath");
      if (pathKey && pathKey !== currentPath) {
        scrollPositions[pathKey] = currentPos;
        sessionStorage.setItem("scrollPositions", JSON.stringify(scrollPositions));
      }
    };

    // Restore scroll position or scroll to top
    const restoreScrollPosition = () => {
      const savedPositions = sessionStorage.getItem("scrollPositions");
      if (savedPositions) {
        Object.assign(scrollPositions, JSON.parse(savedPositions));
      }

      const savedPosition = scrollPositions[currentPath];
      
      if (savedPosition && !isRestoringRef.current) {
        // Restore previous position
        isRestoringRef.current = true;
        window.scrollTo({
          left: savedPosition.x,
          top: savedPosition.y,
          behavior: "auto"
        });
      } else if (!location.hash) {
        // Scroll to top for new sections (only if no hash)
        window.scrollTo({
          left: 0,
          top: 0,
          behavior: "smooth"
        });
      } else if (location.hash) {
        // Handle hash navigation
        setTimeout(() => {
          const element = document.querySelector(location.hash);
          if (element) {
            element.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });
          }
        }, 100);
      }

      // Update current path
      sessionStorage.setItem("currentPath", currentPath);
      isRestoringRef.current = false;
    };

    // Save position before leaving page
    saveScrollPosition();
    
    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(restoreScrollPosition, 50);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [location]);

  // Save scroll position before page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      const currentPath = location.pathname + location.search + location.hash;
      scrollPositions[currentPath] = {
        x: window.scrollX,
        y: window.scrollY
      };
      sessionStorage.setItem("scrollPositions", JSON.stringify(scrollPositions));
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [location]);

  // Function to scroll to section smoothly
  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  };

  // Function to manually save current position
  const saveCurrentPosition = () => {
    const currentPath = location.pathname + location.search + location.hash;
    scrollPositions[currentPath] = {
      x: window.scrollX,
      y: window.scrollY
    };
    sessionStorage.setItem("scrollPositions", JSON.stringify(scrollPositions));
  };

  return {
    scrollToSection,
    saveCurrentPosition
  };
};