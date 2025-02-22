"use client";

import { useEffect, useState } from "react";
import { fetchProducts } from "@/app/utils/api";
import ProductCard from "@/app/task2/components/ProductCard";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number; // Change from string to number
  images: { secure_url: string }[];
}

export default function Home() {
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    fetchProducts()
      .then((data) => setProducts(data)) // data is type Product[]
      .catch((error) => {
        setProducts(null); // Handle errors by setting products to null
        console.error("Error fetching products:", error);
      });
  }, []);

  console.log(products);
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-6">Product List</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products?.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
