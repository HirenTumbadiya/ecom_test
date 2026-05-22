export type HomeProduct = {
  id: number;
  title: string;
  price: number;
  description?: string;
  image?: string;
  images?: string[];
  category?: { id: number; name: string };
  subtitle?: string;
  oldPrice?: number;
  discount?: number;
  rating?: { rate: number; count?: number };
  soldCount?: number;
};

export type CategoryOption = {
  id: number;
  name: string;
  count?: number;
};
