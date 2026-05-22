import { Routes, Route } from "react-router-dom";
import { ROUTES } from "./paths";
import HomePage from "features/home/pages/HomePage";
import ProductDetailPage from "features/product/pages/ProductDetailPage";
import CartPage from "features/cart/pages/CartPage";

const AppRoutes = () => {
  return (
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.PRODUCT} element={<ProductDetailPage />} />
        <Route path={ROUTES.CART} element={<CartPage />} />
      </Routes>
  );
};

export default AppRoutes;