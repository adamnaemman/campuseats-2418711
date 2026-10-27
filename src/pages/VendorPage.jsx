import { useState } from 'react'
import { useParams } from 'react-router'
import CategoryFilter from '../components/CategoryFilter.jsx'
import MenuList from '../components/MenuList.jsx'
import { Loading, ErrorMessage } from '../components/Status.jsx'
import { useVendors } from '../hooks/useVendors.js'

function VendorPage() {
    const { id } = useParams()
    const { vendors, loading, error, reload } = useVendors()
    const [selectedCategory, setSelectedCategory] = useState('All')

    if (loading) return <Loading/>
    if (error) return <ErrorMessage message={error} onRetry={reload}/>
    
    const vendor = vendors.find((v) => v.id === id)

    if (!vendor) {
        return (
            <div className="card">
                <h2>Vendor not found</h2>
                <p className="muted">No vendor with id &ldquo;{id}&rdquo;.</p>
            </div>
        )
    }

    const categories = ['All', ...new Set(vendor.menu.map((item) => item.category))]
    const items = selectedCategory === 'All'
        ? vendor.menu
        : vendor.menu.filter((item) => item.category === selectedCategory)

    return (
        <section>
            <h2 className="section-title">{vendor.name}</h2>
            <p className="muted">{vendor.location} &middot; Open: {vendor.openHours}</p>

            <CategoryFilter 
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
            />

            <MenuList 
                items={items}
                emptyMessage={
                    selectedCategory === 'All'
                        ? 'No items on this menu yet.'
                        : `No ${selectedCategory} items in this menu. Try "All".`
                }
            />
        </section>
    )
}

export default VendorPage