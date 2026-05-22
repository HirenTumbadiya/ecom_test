import { Link } from "react-router-dom";
import { useCart } from "shared/contexts/CartContext";
import { ROUTES } from "app/routes/paths";
import "./CartPage.css";

export default function CartPage() {
  const { items, totalItems, totalPrice, removeItem, clearCart } = useCart();

  return (
    <section className="cart_page" aria-labelledby="cart-heading">
      <header className="cart_header">
        <div>
          <h1 id="cart-heading">Shopping Cart</h1>
          <p>{totalItems} item{totalItems === 1 ? "" : "s"} in your cart</p>
        </div>

        <div className="cart_summary">
          <span className="cart_summary_label">Total</span>
          <strong className="cart_summary_amount">Rs. {Math.round(totalPrice)}</strong>
        </div>
      </header>

      {items.length === 0 ? (
        <section className="cart_empty" role="status" aria-live="polite">
          <p>Your cart is empty.</p>
          <Link to={ROUTES.HOME} className="cart_continue">
            Continue shopping
          </Link>
        </section>
      ) : (
        <>
          <section className="cart_items" aria-label="Cart items">
            {items.map((item) => (
              <article key={item.product.id} className="cart_item">
                <img
                  src={item.product.image ?? item.product.images?.[0] ?? ""}
                  alt={item.product.title}
                  className="cart_item_image"
                />
                <div className="cart_item_info">
                  <Link
                    to={ROUTES.PRODUCT.replace(":productId", String(item.product.id))}
                    className="cart_item_title"
                  >
                    {item.product.title}
                  </Link>
                  <p className="cart_item_desc">{item.product.description ?? item.product.subtitle ?? "No description available."}</p>
                  <div className="cart_item_meta">
                    <span>Qty: {item.quantity}</span>
                    <span>Rs. {Math.round(item.product.price * item.quantity)}</span>
                  </div>
                  <button className="remove_button" onClick={() => removeItem(item.product.id)}>
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </section>

          <div className="cart_footer">
            <button className="clear_cart_button" onClick={clearCart}>
              Remove all items
            </button>
          </div>
        </>
      )}
    </section>
  );
}
