import { Link } from 'react-router'
import OrderStatus from '../components/OrderStatus.jsx'
import { Loading, ErrorMessage } from '../components/Status.jsx'
import { useMyOrders } from '../hooks/useMyOrders.js'
import OrderActions from '../components/OrderActions.jsx'

function OrdersPage() {
    const { orders, loading, error } = useMyOrders()

    if (loading) return <Loading />
    if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />

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
            <ul className="order-list">
                {orders.map((order) => (
                    <li key={order.id} className="card">
                        <p className="cart-name">{order.vendorName} · pickup {order.pickupTime}</p>
                        <p className="muted">{order.items.map((i) => `${i.qty}× ${i.name}`).join(', ')}</p>
                        <p className="muted">Placed {order.createdAt ? order.createdAt.toDate().toLocaleString('en-MY') : 'just now'}</p>
                        <p className="price">RM {order.total.toFixed(2)}</p>
                        <OrderStatus status={order.status} />
                        {order.status === 'Received' && <OrderActions order={order} />}
                    </li>
                ))}
            </ul>
        </section>
    )
}

export default OrdersPage
