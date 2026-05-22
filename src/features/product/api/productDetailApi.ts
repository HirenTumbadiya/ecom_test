import { HomeProduct } from "features/home/types/product";

const BASE_URL = "https://api.escuelajs.co/api/v1";

export const normalizeProduct = (raw: any): HomeProduct => ({
  id: raw.id,
  title: raw.title ?? raw.name,
  price: raw.price ?? 0,
  description: raw.description,
  image: raw.image ?? raw.images?.[0],
  images: raw.images,
  category: raw.category ? { id: raw.category.id, name: raw.category.name } : undefined,
  subtitle: raw.category?.name,
  oldPrice: raw.price ? Math.round(raw.price * 1.6) : undefined,
  discount: raw.price ? Math.round(((Math.round(raw.price * 1.6) - raw.price) / Math.round(raw.price * 1.6)) * 100) : undefined,
  rating: raw.rating ? { rate: raw.rating?.rate ?? raw.rating, count: raw.rating?.count } : undefined,
  soldCount: raw.soldCount ?? raw.rating?.count,
});

export const getProductById = async (productId: string) => {
  const response = await fetch(`${BASE_URL}/products/${productId}`);

  if (!response.ok) {
    throw new Error("Failed to load product details");
  }

  const data = await response.json();
  return normalizeProduct(data);
};
