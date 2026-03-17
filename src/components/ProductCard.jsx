// ProductCard.jsx
import { useCart } from '../context/CartContext';

 function ProductCard({ product }) {
  const { addToCart } = useCart(); // This should now work properly
  
  return (
    <div>
      <h3>{product.name}</h3>
      <button onClick={() => addToCart(product)}>
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;