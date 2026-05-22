import { Link } from "react-router-dom";
import { useCart } from "shared/contexts/CartContext";
import { ROUTES } from "app/routes/paths";
import logo from "assets/logo.png";

import "./Header.css";

const Header = () => {
  const { totalItems } = useCart();

  return (
    <header className="header">
      <Link to="/" className="header_logo" title="Go to Home" aria-label="Go to Home">
        <img
          src={logo}
          alt="E-Commerce Logo"
          className="header_logo_image"
        />
      </Link>

      <nav aria-label="Main navigation">
        <Link to={ROUTES.CART} className="cart_link" title="View Cart" aria-label="View Cart">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          {totalItems > 0 && <span className="cart_count">{totalItems}</span>}
        </Link>
      </nav>
    </header>
  );
};

export default Header;