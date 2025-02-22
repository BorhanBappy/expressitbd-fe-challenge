import Link from "next/link";

interface ProductProps {
  product: {
    _id: string;
    name: string;
    description: string;
    price: string;
    images: { secure_url: string }[];
  };
}

export default function ProductCard({ product }: ProductProps) {
  return (
    <Link href={`/task2/product/${product._id}`}>
      <div className="border p-4 rounded-lg shadow-md hover:shadow-lg cursor-pointer">
        <img
          src={product.images[0]?.secure_url}
          alt={product.name}
          className="w-full h-40 object-cover rounded-md"
        />
        <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
        <p className="text-gray-600">{product.description}</p>
        <p className="text-blue-500 font-bold mt-2">${product.price}</p>
      </div>
    </Link>
  );
}
