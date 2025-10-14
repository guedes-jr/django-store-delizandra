import { Star } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

interface ReviewSectionProps {
  productId: number;
}

const mockReviews: Review[] = [
  {
    id: 1,
    author: "Maria Santos",
    rating: 5,
    date: "15/03/2024",
    comment: "Produto maravilhoso! A qualidade é excelente e o caimento é perfeito. Super recomendo!",
    verified: true,
  },
  {
    id: 2,
    author: "Ana Paula Lima",
    rating: 4,
    date: "12/03/2024",
    comment: "Adorei a peça, muito bonita e bem feita. Apenas achei que poderia ter mais opções de cores.",
    verified: true,
  },
  {
    id: 3,
    author: "Juliana Costa",
    rating: 5,
    date: "08/03/2024",
    comment: "Simplesmente perfeito! A entrega foi rápida e o produto superou minhas expectativas.",
    verified: true,
  },
];

export const ReviewSection = ({ productId }: ReviewSectionProps) => {
  const [reviews] = useState<Review[]>(mockReviews);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleSubmitReview = () => {
    if (!newReview.trim() || rating === 0) {
      toast.error("Por favor, adicione uma avaliação e nota");
      return;
    }
    toast.success("Avaliação enviada com sucesso!");
    setNewReview("");
    setRating(0);
  };

  const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  return (
    <div className="border-t border-border p-8 bg-secondary/30">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h3 className="font-display text-2xl font-bold mb-4">
            Avaliações dos Clientes
          </h3>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              <span className="text-3xl font-bold">{averageRating.toFixed(1)}</span>
            </div>
            <span className="text-muted-foreground">
              Baseado em {reviews.length} avaliações
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card p-6 rounded-xl border border-border">
            <h4 className="font-semibold mb-4">Deixe sua avaliação</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Sua nota</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                    >
                      <Star
                        className={`h-8 w-8 transition-colors ${
                          star <= (hoveredStar || rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Seu comentário
                </label>
                <Textarea
                  placeholder="Conte sobre sua experiência com o produto..."
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  rows={4}
                />
              </div>
              <Button onClick={handleSubmitReview} className="w-full">
                Enviar Avaliação
              </Button>
            </div>
          </div>

          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-card p-6 rounded-xl border border-border"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{review.author}</span>
                    {review.verified && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        Compra verificada
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {review.date}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-foreground">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
