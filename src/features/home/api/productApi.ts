import { HomeProduct } from "features/home/types/product";

const BASE_URL = "https://api.escuelajs.co/api/v1";

type GetProductsParams = {
  offset?: number;
  limit?: number;
  categories?: string[];
  sort?: string;
};

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

export const getProducts = async ({
  offset = 0,
  limit = 12,
  categories = [],
  sort,
}: GetProductsParams) => {
  const params = new URLSearchParams();

  params.append("offset", offset.toString());
  params.append("limit", limit.toString());

  if (categories.length > 0) {
    params.append("categoryId", categories.join(","));
  }

  if (sort) {
    params.append("sortBy", sort);
  }

  const response = await fetch(
    `${BASE_URL}/products?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
};
