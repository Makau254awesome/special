import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImagePlus, X, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Photo {
  id: string;
  url: string;
  caption: string;
  uploadedBy: string;
  date: string;
}

interface GallerySectionProps {
  currentUser: string;
}

const GallerySection = ({ currentUser }: GallerySectionProps) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [caption, setCaption] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const newPhoto: Photo = {
          id: Date.now().toString() + Math.random(),
          url: ev.target?.result as string,
          caption: caption || "A beautiful moment ♥",
          uploadedBy: currentUser,
          date: new Date().toLocaleDateString(),
        };
        setPhotos((prev) => [newPhoto, ...prev]);
        setCaption("");
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-foreground">Our Gallery</h2>
        <Button
          onClick={() => fileRef.current?.click()}
          className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
        >
          <ImagePlus className="w-4 h-4" />
          Upload Photos
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleUpload}
        />
      </div>

      <div className="flex gap-3 items-center">
        <input
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Add a caption for your next upload..."
          className="flex-1 px-4 py-2 rounded-lg bg-card border border-border text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {photos.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="w-16 h-16 text-accent mx-auto mb-4 animate-float" />
          <p className="text-muted-foreground font-body text-lg">No photos yet</p>
          <p className="text-muted-foreground/60 font-body text-sm mt-1">
            Start uploading your beautiful memories together
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo, i) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer border border-border shadow-sm hover:shadow-lg transition-shadow"
              onClick={() => setSelectedPhoto(photo)}
            >
              <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <p className="text-primary-foreground font-body text-sm truncate">{photo.caption}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-3xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={selectedPhoto.url} alt={selectedPhoto.caption} className="w-full rounded-2xl" />
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute -top-3 -right-3 bg-primary text-primary-foreground rounded-full p-2 shadow-lg"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-foreground/70 to-transparent rounded-b-2xl p-4">
                <p className="text-primary-foreground font-display text-lg">{selectedPhoto.caption}</p>
                <p className="text-primary-foreground/70 font-body text-sm">
                  by {selectedPhoto.uploadedBy} • {selectedPhoto.date}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GallerySection;
