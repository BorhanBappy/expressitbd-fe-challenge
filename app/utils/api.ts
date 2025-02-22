import axios, { AxiosError } from "axios";

const API_URL = "https://glore-bd-backend-node-mongo.vercel.app/api/product";

// Define TypeScript interfaces
interface Product {
    _id: string;
    name: string;
    description: string;
    price: number; // Change from string to number
    images: { secure_url: string }[];
  }
  
interface ApiError {
  message: string;
  statusCode?: number;
  timestamp: string;
}

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get<{ data: Product[] }>(API_URL, {
      timeout: 10000, // 10-second timeout
    });

    // Validate response structure
    if (!response.data || !response.data.data) {
      throw new Error("Invalid API response structure");
    }

    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    const timestamp = new Date().toISOString();

    // Create error object
    const apiError: ApiError = {
      message: "Failed to fetch products",
      timestamp,
    };

    if (axiosError.response) {
      // Server responded with error status (4xx/5xx)
      apiError.statusCode = axiosError.response.status;
      apiError.message =
        axiosError.response.data?.message || axiosError.message;
    } else if (axiosError.request) {
      // No response received
      apiError.message = "No response from server - check network connection";
    } else {
      // Other errors
      apiError.message = axiosError.message;
    }

    // Log error for debugging
    console.error("API Error:", {
      url: API_URL,
      error: apiError,
      timestamp,
    });

    // Throw formatted error for error boundaries
    throw new Error(JSON.stringify(apiError));
  }
};
