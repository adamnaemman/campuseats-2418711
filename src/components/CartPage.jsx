import { useState } from 'react'
import CartItem from './CartItem.jsx'
import CheckoutForm from './CheckoutForm.jsx'
import { useCart } from '../hooks/useCart.js'


function CartPage() {
    const { cart, total, changeQty, removeFromCart, placeOrder } = useCart()
    const [lastOrder, setLastOrder] = useState(null)

    function handlePlaceOrder(details) {
        setLastOrder(placeOrder(details))
    }

    if (lastOrder) {
        return (
            <div className="card">
                <h2>Order placed. Thank you!</h2>
                <p>
                    {lastOrder.name}, your food will be ready at {' '}
                    <strong>{lastOrder.pickupTime}</strong> for pick-up at Mahallah {lastOrder.mahallah}.
                </p>
                <p className="cart-total">Total: RM {lastOrder.total.toFixed(2)}</p>
            </div>
        )
    }

    if (cart.length === 0){
        return <p className="muted">Your cart is empty. Pick something from a menu first.</p>
    }
    
    return (
        <div className="cart-layout">
            <div className="card">
                <h2>Your cart</h2>
                <ul className="cart-list">
                    {cart.map((line) => (
                        <CartItem
                            key={line.item.id}
                            line={line}
                            onChangeQty={changeQty}
                            onRemove={removeFromCart}
                        />
                    ))}
                </ul>
                <p className="cart-total">Total: RM {total.toFixed(2)}</p>
            </div>

            <CheckoutForm onPlaceOrder={handlePlaceOrder} />
        </div>
    )
}

export default CartPage