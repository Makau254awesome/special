import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Trash2, Paperclip, Mic, Square, Download, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: number;
  fileData?: {
    type: "image" | "audio" | "file";
    name: string;
    data: string;
    mimeType: string;
  };
}

interface ChatSectionProps {
  currentUser: string;
}

const ChatSection = ({ currentUser }: ChatSectionProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioPlayersRef = useRef<{ [key: string]: HTMLAudioElement }>({});
  const { toast } = useToast();

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem("chat-messages");
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (error) {
        console.error("Failed to load messages:", error);
      }
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("chat-messages", JSON.stringify(messages));
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Recording timer
  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      setRecordingTime(0);
    }
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to record voice notes",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onload = (event) => {
          const audioData = event.target?.result as string;
          sendMessage(audioData, {
            type: "audio",
            name: `voice-note-${Date.now()}.webm`,
            mimeType: "audio/webm",
          });
        };
        reader.readAsDataURL(audioBlob);
      };
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 5MB",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result as string;
      const type = file.type.startsWith("image/") ? "image" : "file";
      sendMessage(data, {
        type,
        name: file.name,
        mimeType: file.type,
      });
    };
    reader.readAsDataURL(file);

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const sendMessage = (content = inputValue, fileData?: Message["fileData"]) => {
    const messageContent = fileData ? "" : content;

    if (!messageContent.trim() && !fileData) {
      toast({
        title: "Empty message",
        description: "Please write something before sending",
        variant: "destructive",
      });
      return;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: currentUser,
      content: messageContent,
      timestamp: Date.now(),
      fileData,
    };

    setMessages([...messages, newMessage]);
    setInputValue("");

    toast({
      title: "Message sent",
      description: fileData ? `Sent ${fileData.type === "audio" ? "voice note" : fileData.type === "image" ? "image" : "file"}` : `${currentUser} sent a message`,
    });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const handleClearChat = () => {
    if (confirm("Are you sure you want to delete all messages? This cannot be undone.")) {
      setMessages([]);
      toast({
        title: "Chat cleared",
        description: "All messages have been deleted",
      });
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getOtherUser = () => {
    return currentUser === "Wangare" ? "Makau" : "Wangare";
  };

  const togglePlayAudio = (messageId: string, audioData: string) => {
    if (playingId === messageId) {
      // Stop playing
      if (audioPlayersRef.current[messageId]) {
        audioPlayersRef.current[messageId].pause();
      }
      setPlayingId(null);
    } else {
      // Stop any other playing audio
      Object.values(audioPlayersRef.current).forEach((audio) => audio.pause());

      // Play this audio
      const audio = new Audio(audioData);
      audioPlayersRef.current[messageId] = audio;
      audio.play();
      setPlayingId(messageId);

      audio.onended = () => {
        setPlayingId(null);
      };
    }
  };

  const messageCount = messages.length;
  const userMessageCount = messages.filter((m) => m.sender === currentUser).length;
  const otherUserMessageCount = messages.filter((m) => m.sender === getOtherUser()).length;

  return (
    <div className="space-y-4 h-[600px] flex flex-col">
      {/* Header with stats */}
      <div className="flex items-center justify-between bg-gradient-love-animate p-4 rounded-xl text-white shadow-lg">
        <div>
          <h2 className="font-display text-2xl font-bold">💬 Chat</h2>
          <p className="text-sm opacity-90">Messages: {messageCount}</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="bg-white/20 px-3 py-1 rounded-full">You: {userMessageCount}</span>
          <span className="bg-white/20 px-3 py-1 rounded-full">{getOtherUser()}: {otherUserMessageCount}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearChat}
            className="text-white hover:bg-white/20"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 bg-gradient-to-b from-card/80 to-card/40 rounded-xl border border-primary/20 p-4 overflow-y-auto space-y-3 backdrop-blur-sm">
        <AnimatePresence mode="popLayout">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="text-5xl mb-3 animate-float">💕</div>
                <p className="text-muted-foreground font-body text-sm">
                  No messages yet. Start the conversation!
                </p>
              </motion.div>
            </div>
          ) : (
            messages.map((message) => {
              const isCurrentUser = message.sender === currentUser;
              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs px-4 py-3 rounded-2xl shadow-lg ${
                      isCurrentUser
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-muted text-foreground rounded-bl-none border border-primary/30"
                    }`}
                  >
                    {!isCurrentUser && (
                      <p className="text-xs font-semibold mb-1.5 opacity-80">{message.sender}</p>
                    )}

                    {/* Text content */}
                    {message.content && (
                      <p className="font-body text-sm break-words mb-2">{message.content}</p>
                    )}

                    {/* File content */}
                    {message.fileData && (
                      <div className="mb-2">
                        {message.fileData.type === "image" && (
                          <motion.img
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            src={message.fileData.data}
                            alt="Shared image"
                            className="rounded-lg max-w-xs h-auto shadow-md"
                          />
                        )}
                        {message.fileData.type === "audio" && (
                          <button
                            onClick={() =>
                              togglePlayAudio(message.id, message.fileData!.data)
                            }
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors"
                          >
                            {playingId === message.id ? (
                              <>
                                <Pause className="w-4 h-4" />
                                <span className="text-xs">Playing...</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-4 h-4" />
                                <span className="text-xs">Voice note</span>
                              </>
                            )}
                          </button>
                        )}
                        {message.fileData.type === "file" && (
                          <a
                            href={message.fileData.data}
                            download={message.fileData.name}
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            <span className="text-xs truncate max-w-xs">
                              {message.fileData.name}
                            </span>
                          </a>
                        )}
                      </div>
                    )}

                    <p className="text-xs mt-1.5 opacity-70">{formatTime(message.timestamp)}</p>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input area with recording */}
      <div className="space-y-3 bg-card/50 p-4 rounded-xl border border-primary/20 backdrop-blur-sm">
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between bg-destructive/20 border border-destructive rounded-lg px-4 py-3"
          >
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                className="w-3 h-3 bg-destructive rounded-full"
              />
              <span className="text-sm font-medium">Recording: {formatRecordingTime(recordingTime)}</span>
            </div>
            <Button
              size="sm"
              variant="destructive"
              onClick={stopRecording}
              className="gap-2"
            >
              <Square className="w-3 h-3" />
              Stop
            </Button>
          </motion.div>
        )}

        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="border-primary/30"
            title="Attach file or image"
          >
            <Paperclip className="w-4 h-4" />
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            accept="image/*,.pdf,.doc,.docx,.txt"
            className="hidden"
          />

          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={isRecording ? stopRecording : startRecording}
            className={`border-primary/30 ${isRecording ? "bg-destructive/10" : ""}`}
            title={isRecording ? "Stop recording" : "Start voice note"}
          >
            <Mic className="w-4 h-4" />
          </Button>

          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Say something sweet..."
            className="flex-1 bg-background/50 border-primary/30"
            maxLength={200}
            disabled={isRecording}
          />
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 gap-2 shadow-lg hover:shadow-xl transition-all"
            disabled={isRecording}
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </Button>
        </form>

        {/* Character counter */}
        <p className="text-xs text-muted-foreground text-right font-body">
          {inputValue.length}/200
        </p>
      </div>
    </div>
  );
};

export default ChatSection;
