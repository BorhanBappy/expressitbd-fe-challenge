import Link from "next/link";
import Image from "next/image";

interface ProductProps {
  product: {
    _id: string;
    name: string;
    description: string;
    price: number;
    images: { secure_url: string }[];
  };
}

export default function ProductCard({ product }: ProductProps) {
  return (
    <Link href={`/task2/product/${product._id}`} className="group">
      <div className="border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 bg-white hover:border-indigo-100 h-full flex flex-col">
        <div className="relative overflow-hidden rounded-lg aspect-square">
          <Image
            fill={true}
            src={product.images[0]?.secure_url || "/placeholder-image.jpg"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="pt-4 flex flex-col flex-grow">
          <h2 className="text-xl font-semibold text-gray-800 line-clamp-1 mb-1">
            {product.name}
          </h2>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3 flex-grow">
            {product.description}
          </p>
          <div className="flex justify-between items-center mt-auto">
            <p className="text-lg font-bold text-coral-500">${product.price}</p>
            <div className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm font-medium group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              View Details
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
