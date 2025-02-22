"use client";
import { useEffect, useState } from "react";
import { fetchProducts } from "@/app/utils/api";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: string;
  images: { secure_url: string; optimizeUrl?: string }[]; // Added optimizeUrl
  video: { secure_url: string };
  category: { name: string }; // Added category field
}

export default function ProductDetail({ params }: { params: { id: string } }) {
  const { id } = params;
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (id) {
      fetchProducts().then((products) => {
        const selectedProduct = products.find((p: Product) => p._id === id);
        setProduct(selectedProduct);
      });
    }
  }, [id]);

  if (!product) return <p className="text-center">Loading...</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-6">
        <img
          src={product.images[0]?.secure_url}
          alt={product.name}
          className="w-full rounded-lg"
        />
        <img
          src={product.images[0]?.optimizeUrl}
          alt={product.name}
          className="w-full rounded-lg"
        />
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-700 mt-2">{product.description}</p>
          <p className="text-gray-700 mt-2">{product.category.name}</p>

          <p className="text-blue-600 font-bold text-xl mt-4">
            ${product.price}
          </p>
          <video controls className="w-full mt-4 rounded-lg">
            <source src={product.video?.secure_url} type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  );
}
