import { useEffect, useState } from "react";
import API from "../services/api";
import Hero from "../components/Hero";

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await API.get("/products");
        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <Hero />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-white mb-10">
          Latest Drop
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-red-600 transition"
            >
              <div className="h-64 bg-zinc-800 flex items-center justify-center text-gray-500">
                PRODUCT IMAGE
              </div>

              <div className="p-6">
                <h2 className="text-lg font-bold text-white">
                  {product.name}
                </h2>

                <p className="text-red-500 font-semibold mt-2">
                  ₹ {product.price}
                </p>

                <button className="mt-4 w-full bg-red-600 hover:bg-red-700 py-2 rounded-lg font-bold transition">
                  ADD TO CART
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;