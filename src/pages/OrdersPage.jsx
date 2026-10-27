import { Link } from 'react-router'
import { useCart } from '../hooks/useCart.js'

function OrdersPage() {
    const { orders } = useCart()

    if (orders.length === 0) {
        return (
            <div className="card">
                <h2>No orders yet</h2>
                <p className="muted">Place an order and it will show up here.</p>
                <Link to="/">Browse vendors</Link>
            </div>
        )
    }

    return (
        <section>
            <h2 className="section-title">Your orders</h2>
            <ul className="cart-list">
                {orders.map((order) => (
                    <li key={order.id} className="card">
                        <h3>Order #{order.id.slice(0, 8)}</h3>
                        <p className="muted">
                            {order.name} &middot; Mahallah {order.mahallah} &middot; Pickup {order.pickupTime}
                        </p>
                        <ul>
                            {order.items.map((line) => (
                                <li key={line.item.id}>
                                    {line.qty} &times; {line.item.name} &mdash; RM {(line.item.price * line.qty).toFixed(2)}
                                </li>
                            ))}
                        </ul>
                        <p className="cart-total">Total: RM {order.total.toFixed(2)}</p>
                    </li>
                ))}
            </ul>
        </section>
    )
}

export default OrdersPage