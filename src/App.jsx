import { useState } from 'react'
import Header from './components/Header.jsx'
import VendorCard from './components/VendorCard.jsx'
import MenuList from './components/MenuList.jsx'
import Footer from './components/Footer.jsx'
import CategoryFilter from './components/CategoryFilter.jsx'
import {Loading, ErrorMessage} from './components/Status.jsx'
import CartPage from './components/CartPage.jsx'
import { useVendors } from './hooks/useVendors.js'

// The menus are a mock API this week; in Week 6 the same shape comes from Firebase
function App() {
  
  const { vendors, loading, error, reload } = useVendors()

  const [view, setView] = useState('menu')
  const [lastOrder, setLastOrder] = useState(null)
  const [selectedVendorId, setSelectedVendorId] = useState(null)
  const activeVendorId = selectedVendorId ?? vendors[0]?.id ?? null
  const [cart, setCart] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  
  function handleSelectVendor(vendorId) {
    setSelectedVendorId(vendorId)
    setSelectedCategory('All')
  }

  function totalOf(cart) {
    return cart.reduce((sum, line) => sum + line.item.price * line.qty, 0)
  }

  
  const selectedVendor = vendors.find((v) => v.id === activeVendorId) || null
  const menu = selectedVendor ? selectedVendor.menu : []
  const categories = ['All', ...new Set(menu.map((item) => item.category))]
  const displayedMenuItems = selectedCategory === 'All' 
  ? menu
  : menu.filter((item) => item.category === selectedCategory)
  
  // const cartTotal = cart.reduce((sum, item) => sum + item.price, 0)
  const cartCount = cart.reduce((count, line) => count + line.qty, 0)
  
  function handleAddToCart(item) {
    setCart((prevCart) => {
      const inCart = prevCart.some((line) => line.item.id === item.id)

      if (inCart) {
        return prevCart.map((line) => 
          line.item.id === item.id ? { ...line, qty: line.qty + 1 } : line,
        )
      }

      return [...prevCart, { item, qty: 1}]
    })
  }

  function handleChangeQty(itemId, delta) {
    setCart((prevCart) => 
      prevCart
        .map((line) => 
          line.item.id === itemId ? { ...line, qty: line.qty + delta} : line, 
        )
        .filter((line) => line.qty > 0)
    )
  }

  function handleRemove(itemId) {
    setCart((prevCart) => prevCart.filter((line) => line.item.id !== itemId))
  }

  function handlePlaceOrder(details) {
    setLastOrder({ ...details, total: totalOf(cart)})
    setCart([]) // Kosongkan cart
    setView('done') // tukar screen kepada "Order Placed"
  }

  let content

  if (view === 'cart') {
    content = (
      <CartPage
        cart={cart}
        onChangeQty={handleChangeQty}
        onRemove={handleRemove}
        onPlaceOrder={handlePlaceOrder}
      />
    )
  } else if (view === 'done') {
    content = lastOrder ? (
      <div className="card">
        <h2>Order placed. Thank you!</h2>
        <p>
          {lastOrder.name}, your food will be ready at {' '}
          <strong>{lastOrder.pickupTime}</strong> for pick-up at Mahallah {lastOrder.mahallah}.
        </p>
        <p className="cart-total">Total: RM {lastOrder.total.toFixed(2)}</p>
        <button type="button" className="btn btn-small" onClick={() => setView('menu')}>
          Back to the menus
        </button>
      </div>
    ) : (
      <p className="muted">No order yet.</p>
    )
  } else if (loading) {
    content = <Loading />
  } else if (error) {
    content = <ErrorMessage message={error} onRetry={reload}/>
  } else if (vendors.length === 0) {
    content = <p className="muted">No vendors have opened yet.</p>
  } else {
    content = (
      <>
        <section>
          <h2 className="section-title">Choose a vendor</h2>
          <div className="vendor-grid">
            {vendors.map((vendor) => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                isSelected={vendor.id === activeVendorId}
                onSelect={handleSelectVendor}
              />
            ))}
          </div>
        </section>


        <section>
          <h2 className="section-title">Menu: {selectedVendor.name}</h2>
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          <MenuList 
            items={displayedMenuItems} 
            onAdd={handleAddToCart}
            emptyMessage={
              selectedCategory === 'All'
              ? 'No items on this menu yet.'
              : `No ${selectedCategory} items in this menu. Try "All".`
            } 
          />
        </section>
      </>
    )
  }
  
  return (
    <>
      <Header 
        cartCount={cartCount} 
        onShowMenu={() => setView('menu')}
        onShowCart={() => setView('cart')}/>
      <main className="container">
        {content}
      </main>
      <Footer />
    </>
  )
}
 
export default App