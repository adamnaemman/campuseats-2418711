import { useState } from 'react'
import Header from './components/Header.jsx'
import VendorCard from './components/VendorCard.jsx'
import MenuList from './components/MenuList.jsx'
import Footer from './components/Footer.jsx'
import CategoryFilter from './components/CategoryFilter.jsx'
import {Loading, ErrorMessage} from './components/Status.jsx'
import CartPage from './components/CartPage.jsx'
import { useVendors } from './hooks/useVendors.js'
import { CartProvider } from './context/CartProvider.jsx'

// The menus are a mock API this week; in Week 6 the same shape comes from Firebase
function App() {
  const { vendors, loading, error, reload } = useVendors()

  const [view, setView] = useState('menu')
  const [selectedVendorId, setSelectedVendorId] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('All')
  
  const activeVendorId = selectedVendorId ?? vendors[0]?.id ?? null
  
  function handleSelectVendor(vendorId) {
    setSelectedVendorId(vendorId)
    setSelectedCategory('All')
  }
  
  const selectedVendor = vendors.find((v) => v.id === activeVendorId) || null
  const menu = selectedVendor ? selectedVendor.menu : []
  const categories = ['All', ...new Set(menu.map((item) => item.category))]
  const displayedMenuItems = selectedCategory === 'All' 
    ? menu
    : menu.filter((item) => item.category === selectedCategory)

  let content

  if (view === 'cart') {
    content = <CartPage/>
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
    <CartProvider>
      <Header  
        onShowMenu={() => setView('menu')}
        onShowCart={() => setView('cart')}
      />
      <main className="container">
        {content}
      </main>
      <Footer />
    </CartProvider>
  )
}
 
export default App