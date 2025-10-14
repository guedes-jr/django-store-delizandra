import { X, Heart, MessageCircle, Share2 } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { Input } from "./ui/input";

interface VideoPlayerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VideoPlayer = ({ isOpen, onClose }: VideoPlayerProps) => {
  const [likes, setLikes] = useState(127);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([
    { id: 1, author: "Maria Silva", text: "Adorei essa coleção! 😍", time: "2h" },
    { id: 2, author: "Ana Paula", text: "Quando chega a nova coleção?", time: "5h" },
    { id: 3, author: "Juliana Costa", text: "Perfeito! Vou encomendar", time: "1d" },
  ]);
  const [newComment, setNewComment] = useState("");

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  const handleComment = () => {
    if (newComment.trim()) {
      setComments([
        { id: Date.now(), author: "Você", text: newComment, time: "agora" },
        ...comments,
      ]);
      setNewComment("");
    }
  };

  const handleWhatsApp = () => {
    window.open("https://wa.me/5511999999999", "_blank");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md h-[90vh] bg-background rounded-2xl overflow-hidden shadow-2xl">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full"
        >
          <X className="h-5 w-5" />
        </Button>

        <div className="h-full flex flex-col">
          <div className="flex-1 relative bg-gradient-to-br from-primary/20 to-accent/20">
            <video
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            >
              <source
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                type="video/mp4"
              />
            </video>

            <div className="absolute right-4 bottom-24 flex flex-col gap-6">
              <button
                onClick={handleLike}
                className="flex flex-col items-center gap-1 text-white"
              >
                <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur flex items-center justify-center hover:bg-black/60 transition-colors">
                  <Heart
                    className={`h-6 w-6 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
                  />
                </div>
                <span className="text-xs font-semibold">{likes}</span>
              </button>

              <button className="flex flex-col items-center gap-1 text-white">
                <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur flex items-center justify-center hover:bg-black/60 transition-colors">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <span className="text-xs font-semibold">{comments.length}</span>
              </button>

              <button className="flex flex-col items-center gap-1 text-white">
                <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur flex items-center justify-center hover:bg-black/60 transition-colors">
                  <Share2 className="h-6 w-6" />
                </div>
              </button>

              <button
                onClick={handleWhatsApp}
                className="flex flex-col items-center gap-1 text-white"
              >
                <div className="w-12 h-12 rounded-full bg-green-500 backdrop-blur flex items-center justify-center hover:bg-green-600 transition-colors shadow-lg">
                  <FaWhatsapp className="h-7 w-7" />
                </div>
              </button>
            </div>
          </div>

          <div className="h-64 bg-card border-t border-border flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        {comment.author}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {comment.time}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-border bg-background">
              <div className="flex gap-2">
                <Input
                  placeholder="Adicione um comentário..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleComment()}
                  className="flex-1"
                />
                <Button onClick={handleComment} size="sm">
                  Enviar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
