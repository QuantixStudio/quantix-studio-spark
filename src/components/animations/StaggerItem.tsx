import { motion, HTMLMotionProps, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

interface StaggerItemProps extends Omit<HTMLMotionProps<"div">, "variants"> {
  children: ReactNode;
}

export const StaggerItem = ({ children, className, ...props }: StaggerItemProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={{
        hidden: { 
          opacity: 0, 
          y: shouldReduceMotion ? 0 : 40, 
          scale: shouldReduceMotion ? 1 : 0.95 
        },
        visible: { 
          opacity: 1, 
          y: 0, 
          scale: 1 
        },
      }}
      transition={{ 
        duration: shouldReduceMotion ? 0.1 : 0.6, 
        ease: [0.25, 0.1, 0.25, 1.0] 
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};
