import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const LOVE_NOTES = [
  { title: "You Are My Sunshine", message: "Every moment with you feels like a warm embrace on a rainy day. You light up my world. ☀️" },
  { title: "Forever Yours", message: "In a world full of chaos, you are my peace. I choose you, today and always. 💫" },
  { title: "My Heart's Home", message: "Home isn't a place — it's wherever I'm with you. You're my favorite destination. 🏡" },
  { title: "Love Letter", message: "If I had a flower for every time you made me smile, I'd have an endless garden. 🌸" },
  { title: "Grateful Heart", message: "Thank you for loving me on my worst days and celebrating my best. You're my everything. 💝" },
  { title: "Starlight", message: "Of all the stars in the sky, you're the one that guides me home every night. ⭐" },
  { title: "Soulmate", message: "I didn't believe in soulmates until I found you. Now I know magic is real. ✨" },
  { title: "My Person", message: "You're not just my love — you're my best friend, my confidant, my whole heart. 💗" },
  { title: "Endless Love", message: "I fall in love with you a little more each day. There is no limit to my love for you. 💕" },
  { title: "Dream Come True", message: "I used to dream of someone like you. Now I wake up next to my dream every day. 🌙" },
  { title: "Beautiful Soul", message: "Your beauty isn't just skin deep — your soul radiates warmth that heals my world. 🌹" },
  { title: "Together Forever", message: "With you, every ordinary day becomes an extraordinary adventure. Here's to forever. 💐" },
];

const CARD_COLORS = [
  "from-love-pink to-love-blush",
  "from-love-blush to-love-cream",
  "from-love-rose/20 to-love-pink",
  "from-love-gold/20 to-love-cream",
];

const LoveCardsSection = () => {
  const [cards, setCards] = useState<typeof LOVE_NOTES>([]);
  const [lastRefresh, setLastRefresh] = useState<string>("");

  const generateCards = () => {
    const shuffled = [...LOVE_NOTES].sort(() => Math.random() - 0.5);
    setCards(shuffled.slice(0, 4));
    setLastRefresh(new Date().toLocaleString());
    localStorage.setItem("love-cards-date", new Date().toDateString());
    localStorage.setItem("love-cards", JSON.stringify(shuffled.slice(0, 4)));
  };

  useEffect(() => {
    const savedDate = localStorage.getItem("love-cards-date");
    const today = new Date().toDateString();
    if (savedDate === today) {
      const saved = localStorage.getItem("love-cards");
      if (saved) {
        setCards(JSON.parse(saved));
        setLastRefresh("Today");
        return;
      }
    }
    generateCards();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold bg-gradient-love-animate bg-clip-text text-transparent">Love Cards</h2>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground font-body">Refreshes daily</span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateCards}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-primary/30 rounded-lg text-foreground hover:bg-primary/10 hover:border-primary/50 transition-all"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <RefreshCw className="w-3 h-3" />
            </motion.div>
            New Cards
          </motion.button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {cards.map((card, i) => (
            <motion.div
              key={card.title + i}
              initial={{ opacity: 0, y: 20, rotateZ: -2, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, rotateZ: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`bg-gradient-to-br ${CARD_COLORS[i % CARD_COLORS.length]} p-6 rounded-2xl border border-primary/20 shadow-lg cursor-default overflow-hidden group relative`}
            >
              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                animate={{ x: ["0%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
              />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-display text-lg font-bold text-foreground">{card.title}</h3>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                  >
                    <Heart className="w-5 h-5 text-primary fill-primary flex-shrink-0" />
                  </motion.div>
                </div>
                <p className="text-foreground/80 font-body text-sm leading-relaxed">
                  {card.message}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LoveCardsSection;
