import { ProductCard } from "./ProductCard";

const products = [
  {
    id: 1,
    name: "Vestido Midi Jeans",
    price: 189.90,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=700&fit=crop",
    colors: ["#9CC5E3", "#E8B5D6"],
    sizes: ["P", "M", "G"],
    rating: 4.9,
    reviews: 28,
  },
  {
    id: 2,
    name: "Conjunto Cropped Jeans",
    price: 249.90,
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&h=700&fit=crop",
    colors: ["#9CC5E3"],
    sizes: ["P", "M", "G"],
    rating: 5.0,
    reviews: 42,
  },
  {
    id: 3,
    name: "Vestido Tomara que Caia Rosa",
    price: 169.90,
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500&h=700&fit=crop",
    colors: ["#E8B5D6"],
    sizes: ["P", "M", "G"],
    rating: 4.8,
    reviews: 35,
  },
  {
    id: 4,
    name: "Conjunto Moletom Rosa",
    price: 219.90,
    image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=500&h=700&fit=crop",
    colors: ["#E8B5D6", "#9CC5E3"],
    sizes: ["P", "M", "G"],
    rating: 4.7,
    reviews: 31,
  },
  {
    id: 5,
    name: "Jaqueta Jeans Cropped",
    price: 279.90,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=700&fit=crop",
    colors: ["#9CC5E3"],
    sizes: ["P", "M", "G"],
    rating: 4.9,
    reviews: 24,
  },
  {
    id: 6,
    name: "Vestido Midi Botões",
    price: 199.90,
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&h=700&fit=crop",
    colors: ["#9CC5E3", "#E8B5D6"],
    sizes: ["P", "M", "G"],
    rating: 5.0,
    reviews: 38,
  },
];

export const ProductGrid = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl font-light tracking-wider text-foreground mb-2">
            NEW IN
          </h2>
          <p className="text-sm text-muted-foreground">
            Confira os últimos lançamentos
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
