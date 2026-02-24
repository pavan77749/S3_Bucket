"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("📡 Fetching products...");

        const res = await fetch("http://localhost:5000/api/products");

        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await res.json();

        console.log("✅ Products received:", data);

        setProducts(data);

      } catch (err) {
        console.error("❌ Error fetching products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading products...
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  // Empty State
  if (!products.length) {
    return (
      <div className="flex justify-center items-center h-screen">
        No products found.
      </div>
    );
  }

  return (
    <main className="p-6 bg-gray-900 min-h-screen">
      <h1 className="text-3xl text-white font-bold mb-6">
        Product List
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

        {products.map((product) => (
          <article
            key={product._id}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <div className="relative w-full h-48">

              <Image
                src={`https://d2tawi1wrgna2h.cloudfront.net/${product.imageName}`}
                alt={product.productName}
                fill
                className="object-cover"
              />

            </div>

            <div className="p-4 space-y-2">
              <h2 className="text-lg font-semibold text-black">
                {product.productName}
              </h2>

              <p className="text-sm text-gray-600">
                {product.description}
              </p>

              <p className="text-indigo-600 font-bold">
                ₹ {product.price}
              </p>

              <p className="text-xs text-gray-400">
                {new Date(product.createdAt).toLocaleDateString()}
              </p>
            </div>
          </article>
        ))}

      </div>
    </main>
  );
}