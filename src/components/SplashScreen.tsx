import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import heartIcon from "@/assets/heart-icon.png";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 300);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary/20 via-background to-primary/10 flex flex-col items-center justify-center z-50 overflow-hidden">
      {/* Animated background waves */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="absolute w-96 h-96 bg-primary/5 rounded-full top-1/4 left-1/4 blur-3xl"
          animate={{ scale: [1, 1.2, 1], rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute w-72 h-72 bg-accent/5 rounded-full bottom-1/4 right-1/4 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity }}
        />
      </motion.div>

      <motion.div
        initial={{ scale: 0, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", type: "spring" }}
        className="flex flex-col items-center gap-6 relative z-10"
      >
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, rotate: { duration: 6 } }}
          className="relative w-24 h-24"
        >
          <img
            src={heartIcon}
            alt="Heart"
            className="w-full h-full drop-shadow-lg"
          />
          <motion.div
            className="absolute inset-0 bg-primary/20 rounded-full blur-md"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="font-display text-4xl md:text-5xl font-bold bg-gradient-love-animate bg-clip-text text-transparent tracking-wide"
        >
          Our Love Story
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="font-body text-muted-foreground text-lg tracking-widest uppercase"
        >
          Loading your memories...
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="w-64 h-2 bg-primary/20 rounded-full overflow-hidden mt-4 shadow-lg"
        >
          <motion.div
            className="h-full bg-gradient-love rounded-full shadow-lg"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </motion.div>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-muted-foreground text-sm font-body font-bold"
        >
          {progress}%
        </motion.span>
      </motion.div>

      {/* Floating hearts with better effects */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-primary/30 text-4xl drop-shadow-lg"
          initial={{ y: "100vh", x: `${10 + i * 12}vw`, opacity: 0, scale: 0 }}
          animate={{
            y: "-10vh",
            opacity: [0, 1, 0.5],
            scale: [0, 1, 0.8],
            rotate: [0, 360, 180],
          }}
          transition={{
            duration: 4 + i * 0.3,
            delay: i * 0.5,
            repeat: Infinity,
            ease: "easeOut",
          }}
        >
          💕
        </motion.div>
      ))}
    </div>
  );
};

export default SplashScreen;
