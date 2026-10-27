import { useCart } from "../hooks/useCart.js"

function Header({ onShowMenu, onShowCart }) {
const { count } = useCart()

    return (
        <header className="header">
        <h1 className="logo">CampusEats</h1>
        <nav className="nav">
            <button type="button" className="link" onClick={onShowMenu}>Vendors</button>
            <button type="button" className="link cart" onClick={onShowCart}>
                Cart <span className="badge">{count}</span>
            </button>
        </nav>
        </header>
    )
}

export default Header