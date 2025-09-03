import { useEffect } from "react";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";

interface ScrollToSectionProps {
  sectionId: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * Component that wraps any clickable element and adds smooth scroll behavior
 * to navigate to a specific section while preserving scroll restoration
 */
const ScrollToSection: React.FC<ScrollToSectionProps> = ({ 
  sectionId, 
  children, 
  className = "",
  onClick 
}) => {
  const { scrollToSection, saveCurrentPosition } = useScrollRestoration();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Save current position before scrolling
    saveCurrentPosition();
    
    // Execute custom onClick if provided
    if (onClick) {
      onClick();
    }

    // Scroll to the target section
    scrollToSection(sectionId);
  };

  return (
    <div className={className} onClick={handleClick} role="button" tabIndex={0}>
      {children}
    </div>
  );
};

export default ScrollToSection;