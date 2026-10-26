import { useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import VendorCard from './components/VendorCard.jsx'
import MenuList from './components/MenuList.jsx'
import Footer from './components/Footer.jsx'
import CategoryFilter from './components/CategoryFilter.jsx'
import {Loading, ErrorMessage} from './components/Status.jsx'
import CartPage from './components/CartPage.jsx'

// The menus are a mock API this week; in Week 6 the same shape comes from Firebase
const VENDORS_URL = '/api/vendors.json'

function totalOf(cart) {
  return cart.reduce((sum, line) => sum + line.item.price * line.qty, 0)
}

function App() {
  // B2: data that arrives from the API, plus the states of that request.
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [view, setView] = useState('menu')
  const [lastOrder, setLastOrder] = useState(null)

  const [selectedVendorId, setSelectedVendorId] = useState(null)
  const [cart, setCart] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')

  useEffect(() => {
    const controller = new AbortController() 

    async function loadVendors() { 
      try {
        const response = await fetch(VENDORS_URL, { signal: controller.signal })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data = await response.json()

        setVendors(data)
        setSelectedVendorId(data[0]?.id ?? null) // we choose first vendors
        setLoading(false)
      } catch (err) {
        if (err.name === 'AbortError') return 
        setError(err.message)
        setLoading(false)
      }
    }

    loadVendors()

    return () => controller.abort()
  }, [reloadKey])

  function handleRetry() {
    setLoading(true)
    setError(null)
    setReloadKey((key) => key + 1)
  }

  function handleSelectVendor(vendorId) {
    setSelectedVendorId(vendorId)
    setSelectedCategory('All')
  }
  
  // Everything below is DERIVED from state on every render, not stored
  const selectedVendor = vendors.find((v) => v.id === selectedVendorId) || null
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
    content = <ErrorMessage message={error} onRetry={handleRetry}/>
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
                isSelected={vendor.id === selectedVendorId}
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