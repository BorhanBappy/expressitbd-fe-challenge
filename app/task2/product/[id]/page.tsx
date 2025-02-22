"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchProducts } from "@/app/utils/api";
import Image from "next/image";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: { secure_url: string; optimizeUrl?: string }[];
  video?: { secure_url: string };
  category?: { name: string };
}

export default function ProductDetail() {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        if (!id) throw new Error("Invalid product ID");

        const products = await fetchProducts();
        const selectedProduct = (products as Product[]).find(
          (p) => p._id === id
        );

        if (!selectedProduct) throw new Error(`Product ${id} not found`);
        setProduct(selectedProduct);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!product) return <p className="text-center">Product not found</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Image Section */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src={product.images[0]?.secure_url}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          {product.images[0]?.optimizeUrl && (
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <Image
                src={product.images[0].optimizeUrl}
                alt={`Optimized ${product.name}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-700">{product.description}</p>

          {product.category?.name && (
            <p className="text-gray-700">Category: {product.category.name}</p>
          )}

          <p className="text-blue-600 font-bold text-xl">${product.price}</p>

          {product.video?.secure_url && (
            <video
              controls
              className="w-full mt-4 rounded-lg"
              preload="metadata"
            >
              <source src={product.video.secure_url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      </div>
    </div>
  );
}
