import ProductCard from './ProductCard';

export default function RecommendationGrid({ recommendations }) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {recommendations.map((rec, index) => (
        <ProductCard 
          key={rec.product_id || rec.recommended_product_id || index} 
          product={rec} 
        />
      ))}
    </div>
  );
}