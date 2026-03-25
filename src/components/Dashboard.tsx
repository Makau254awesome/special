import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Image, Music, Calendar, Sparkles, LogOut, MessageCircle } from "lucide-react";
import GallerySection from "./GallerySection";
import MusicSection from "./MusicSection";
import CalendarSection from "./CalendarSection";
import LoveCardsSection from "./LoveCardsSection";
import ChatSection from "./ChatSection";

type Tab = "love" | "gallery" | "music" | "calendar" | "chat";

interface DashboardProps {
  currentUser: string;
  onLogout: () => void;
}

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "love", label: "Love Cards", icon: <Sparkles className="w-4 h-4" /> },
  { id: "gallery", label: "Gallery", icon: <Image className="w-4 h-4" /> },
  { id: "music", label: "Music", icon: <Music className="w-4 h-4" /> },
  { id: "calendar", label: "Calendar", icon: <Calendar className="w-4 h-4" /> },
  { id: "chat", label: "Chat", icon: <MessageCircle className="w-4 h-4" /> },
];

const Dashboard = ({ currentUser, onLogout }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState<Tab>("love");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-md border-b border-primary/20 sticky top-0 z-40 shadow-lg">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="relative w-6 h-6"
            >
              <Heart className="w-6 h-6 text-primary fill-primary" />
            </motion.div>
            <h1 className="font-display text-2xl font-bold bg-gradient-love-animate bg-clip-text text-transparent">
              Our Love Story
            </h1>
          </motion.div>
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-sm font-body text-muted-foreground">
              Hey, <span className="text-primary font-bold animate-pulse">{currentUser}</span> 💕
            </span>
            <motion.button
              onClick={onLogout}
              className="text-muted-foreground hover:text-primary transition-colors"
              whileHover={{ scale: 1.2, rotate: 10 }}
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-card/50 border-b border-primary/20 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {TABS.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className={`relative flex items-center gap-2 px-4 py-3 font-body text-sm transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.icon}
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 inset-x-0 h-1 bg-gradient-love rounded-full shadow-lg"
                />
              )}
            </motion.button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
        >
          {activeTab === "love" && <LoveCardsSection />}
          {activeTab === "gallery" && <GallerySection currentUser={currentUser} />}
          {activeTab === "music" && <MusicSection currentUser={currentUser} />}
          {activeTab === "calendar" && <CalendarSection />}
          {activeTab === "chat" && <ChatSection currentUser={currentUser} />}
        </motion.div>
      </main>
    </div>
  );
};
};

export default Dashboard;
