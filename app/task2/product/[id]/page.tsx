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
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        if (!id) throw new Error("Invalid product ID");
        const products = await fetchProducts();
        const selectedProduct = products.find((p) => p._id === id);
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
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Side: Image and Video Section */}
        <div className="flex flex-col gap-4">
          {/* Main Image Section */}
          <div className="relative ml-12">
            <div
              className="relative h-[300px] w-[200px]"
              style={{ pointerEvents: "none" }} // Disable pointer events on container
            >
              <Image
                src={product.images[0]?.secure_url}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-contain transition-transform duration-300 "
                style={{
                  transform: "scale(0.8)",
                  transformOrigin: "center center",
                  pointerEvents: "auto", // Enable pointer events only on image
                }}
                onClick={() => setIsHovered(!isHovered)} // onMouseLeave={() => setIsHovered(false)}
              />
            </div>

            {/* Original size overlay */}
            {isHovered && (
              <div
                className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
                onClick={() => setIsHovered(!isHovered)}
              >
                <div className="relative max-w-[90vw] max-h-[90vh]">
                  <Image
                    src={product.images[0]?.secure_url}
                    alt={product.name}
                    width={500}
                    height={600}
                    className="object-contain"
                    quality={100}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Optimized Image & Video Section */}
          <div className="flex gap-4 items-center justify-center">
            {product.images[0]?.optimizeUrl && (
              <div className="relative aspect-square rounded-lg overflow-hidden cursor-pointer">
                <Image
                  src={product.images[0].optimizeUrl}
                  alt={`Optimized ${product.name}`}
                  width={200}
                  height={100}
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            )}

            {product.video?.secure_url && (
              <div className="relative aspect-video ">
                <video
                  controls
                  className="rounded-lg transition-transform duration-300 hover:scale-105 w-[200px] h-[200px]"
                >
                  <source src={product.video.secure_url} type="video/mp4" />
                  Your browser does not support videos
                </video>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Product Info */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-700">{product.description}</p>

          {product.category?.name && (
            <p className="text-gray-700">Category: {product.category.name}</p>
          )}

          <p className="text-blue-600 font-bold text-xl">${product.price}</p>

          <div className="flex space-x-4">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
              Add to Cart
            </button>
            <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
