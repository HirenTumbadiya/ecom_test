import { type ReactNode } from "react";
import { CartProvider } from "shared/contexts/CartContext";

type AppProviderProps = {
  children: ReactNode;
};

export default function AppProvider({ children }: AppProviderProps) {
  return <CartProvider>{children}</CartProvider>;
}
