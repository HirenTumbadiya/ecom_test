import "./ProductCard.css"
import { HomeProduct } from "features/home/types/product";

export default function ProductCard({ product }: { product: HomeProduct }) {
    const image = product.image ?? product.images?.[0] ?? "";
    const price = Number(product.price) || 0;
    const oldPrice = product.oldPrice ?? Math.round(price * 1.6);
    const discount = product.discount ?? Math.round(((oldPrice - price) / oldPrice) * 100);
    const rating = product.rating?.rate ?? 4.4;
    const soldCount = product.soldCount ?? product.rating?.count ?? 22500;
    const soldLabel = soldCount >= 1000 ? `${(soldCount / 1000).toFixed(1)}k` : `${soldCount}`;
    const subtitle = product.subtitle ?? "Solid Lounge T-shirt";

    return (
        <article className="product_card">
            <div className="product_card_badges">
                <span className="product_badge rating_badge">
                    <span className="star">★</span>
                    {rating.toFixed(1)}
                </span>
                <span className="product_badge sold_badge">{soldLabel} sold</span>
            </div>

            <div className="product_image_wrap">
                <img src={image} alt={product.title} className="product_image" />
            </div>

            <div className="product_body">
                <p className="product_category">{subtitle}</p>
                <h3 className="product_title">{product.title}</h3>

                <div className="product_pricing">
                    <strong className="product_price">Rs. {Math.round(price)}</strong>
                    <span className="product_oldprice">Rs. {Math.round(oldPrice)}</span>
                </div>

                <span className="product_discount">{discount}% OFF</span>
            </div>
        </article>
    );
}
