import axios from "axios";

const API_URL = "https://glore-bd-backend-node-mongo.vercel.app/api/product";

export const fetchProducts = async () => {
  const response = await axios.get(API_URL);
  return response.data.data;
};
