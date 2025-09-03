import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const useScrollRestoration = () => {
  const location = useLocation();

  useEffect(() => {
    // Always scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  // Function to scroll to calculator section smoothly
  const scrollToCalculator = (calculatorId: string) => {
    const element = document.querySelector(calculatorId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  };

  return {
    scrollToCalculator
  };
};