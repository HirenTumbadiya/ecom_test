import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "shared/contexts/CartContext";
import { HomeProduct } from "features/home/types/product";
import "./ProductDetailPage.css";
import { getProductById } from "../api/productDetailApi";

export default function ProductDetailPage() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { addItem } = useCart();
    const [product, setProduct] = useState<HomeProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        if (!productId) {
            setError("No product selected.");
            setLoading(false);
            return;
        }

        setLoading(true);
        getProductById(productId)
            .then((data) => {
                setProduct(data);
                setError(null);
            })
            .catch(() => {
                setError("Could not load product details.");
            })
            .finally(() => setLoading(false));
    }, [productId]);

    const handleAddToCart = () => {
        if (!product) {
            return;
        }

        addItem(product);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 2000);
    };

    return (
        <section className="product_detail_page" aria-labelledby="product-detail-heading">
            <button className="detail_back" onClick={() => navigate(-1)}>
                ← Back
            </button>

            {loading && <div className="detail_status">Loading product...</div>}
            {error && <div className="detail_status error">{error}</div>}
            {!loading && product && (
                <article className="detail_card" aria-label="Product details">
                    <div className="detail_image_wrap">
                        <img
                            src={product.image ?? product.images?.[0] ?? ""}
                            alt={product.title}
                            className="detail_image"
                        />
                    </div>
                    <div className="detail_info">
                        <p className="detail_category">{product.category?.name ?? "Apparel"}</p>
                        <h1 id="product-detail-heading" className="detail_title">{product.title}</h1>
                        <p className="detail_price">Rs. {Math.round(product.price)}</p>
                        <p className="detail_description">{product.description ?? "No description available."}</p>
                        <div className="detail_actions">
                            <button className="detail_add_button" onClick={handleAddToCart}>
                                Add to Cart
                            </button>
                            {added && <div className="detail_added">Added to cart!</div>}
                        </div>
                    </div>
                </article>
            )}
        </section>
    );
}
