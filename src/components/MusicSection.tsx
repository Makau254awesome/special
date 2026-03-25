import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Music, Play, Pause, Upload, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Song {
  id: string;
  name: string;
  url: string;
  uploadedBy: string;
  date: string;
}

interface MusicSectionProps {
  currentUser: string;
}

const MusicSection = ({ currentUser }: MusicSectionProps) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [playing, setPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      const newSong: Song = {
        id: Date.now().toString() + Math.random(),
        name: file.name.replace(/\.[^/.]+$/, ""),
        url,
        uploadedBy: currentUser,
        date: new Date().toLocaleDateString(),
      };
      setSongs((prev) => [newSong, ...prev]);
    });
  };

  const togglePlay = (song: Song) => {
    if (playing === song.id) {
      audioRef.current?.pause();
      setPlaying(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(song.url);
      audio.play();
      audio.onended = () => setPlaying(null);
      audioRef.current = audio;
      setPlaying(song.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-foreground">Our Music</h2>
        <Button
          onClick={() => fileRef.current?.click()}
          className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload Song
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="audio/*"
          multiple
          className="hidden"
          onChange={handleUpload}
        />
      </div>

      {songs.length === 0 ? (
        <div className="text-center py-20">
          <Music className="w-16 h-16 text-accent mx-auto mb-4 animate-float" />
          <p className="text-muted-foreground font-body text-lg">No songs yet</p>
          <p className="text-muted-foreground/60 font-body text-sm mt-1">
            Upload your favorite songs to share
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {songs.map((song, i) => (
            <motion.div
              key={song.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                playing === song.id
                  ? "bg-primary/10 border-primary/30 shadow-md"
                  : "bg-card border-border hover:border-primary/20"
              }`}
              onClick={() => togglePlay(song)}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  playing === song.id ? "bg-primary" : "bg-muted"
                }`}
              >
                {playing === song.id ? (
                  <Pause className="w-5 h-5 text-primary-foreground" />
                ) : (
                  <Play className="w-5 h-5 text-foreground ml-0.5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body font-bold text-foreground truncate">{song.name}</p>
                <p className="text-muted-foreground text-sm font-body">
                  Uploaded by {song.uploadedBy} • {song.date}
                </p>
              </div>
              {playing === song.id && (
                <Heart className="w-5 h-5 text-primary fill-primary animate-heartbeat" />
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MusicSection;
