import { Link } from "react-router-dom";
import ProductCard from "../ProductCard/ProductCard";
import { HomeProduct } from "features/home/types/product";
import { ROUTES } from "app/routes/paths";
import "./ProductGrid.css";

export default function ProductGrid({ products }: { products: HomeProduct[] }) {
    if (products.length === 0) {
        return <section className="product_grid_empty" role="status">No products match the selected filters.</section>;
    }

    return (
        <section className="product_grid" aria-label="Product list">
            {products.map((product) => (
                <Link
                    key={product.id}
                    to={ROUTES.PRODUCT.replace(":productId", String(product.id))}
                    className="product_link"
                >
                    <ProductCard product={product} />
                </Link>
            ))}
        </section>
    );
}
