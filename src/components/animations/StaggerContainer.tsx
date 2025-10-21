import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export const StaggerContainer = ({ 
  children, 
  className,
  staggerDelay = 0.1 
}: StaggerContainerProps) => {
  // Responsive viewport amount
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const amount = isMobile ? 0.2 : 0.3;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
