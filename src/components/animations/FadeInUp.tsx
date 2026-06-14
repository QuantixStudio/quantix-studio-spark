import { motion, HTMLMotionProps, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

interface FadeInUpProps extends Omit<HTMLMotionProps<"div">, "initial" | "whileInView"> {
  children: ReactNode;
  delay?: number;
  duration?: number;
  amount?: number;
}

export const FadeInUp = ({ 
  children, 
  delay = 0, 
  duration = 0.6, 
  amount,
  className,
  ...props 
}: FadeInUpProps) => {
  const shouldReduceMotion = useReducedMotion();
  
  // Responsive viewport amount: mobile (20%), desktop (30%)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const responsiveAmount = amount ?? (isMobile ? 0.2 : 0.3);

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: shouldReduceMotion ? 0.1 : duration, 
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0.25, 0.1, 0.25, 1.0]
      }}
      viewport={{ once: true, amount: responsiveAmount }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};
