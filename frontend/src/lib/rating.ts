export function pseudoRating(productId: number): number {
  const x = Math.sin(productId) * 10000;
  const base = 3.6 + (x - Math.floor(x)) * 1.4; // entre 3.6 e 5.0
  return Math.round(base * 10) / 10;
}

export function pseudoReviews(productId: number): number {
  const x = Math.cos(productId) * 10000;
  return 8 + Math.floor(Math.abs(x) % 92); // 8..99
}
