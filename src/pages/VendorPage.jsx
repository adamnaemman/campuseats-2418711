import { Link, useParams, useSearchParams } from 'react-router'
import { useVendor } from '../hooks/useVendor.js'
import { useAuth } from '../hooks/useAuth.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import CategoryFilter from '../components/CategoryFilter.jsx'
import MenuList from '../components/MenuList.jsx'
import { Loading, ErrorMessage } from '../components/Status.jsx'

function VendorPage() {
    const { id } = useParams()
    const [searchParams, setSearchParams] = useSearchParams()
    const { user } = useAuth()
    const [savedCategory, setSavedCategory] = useLocalStorage('ce-category-' + (user ? user.uid : 'guest'), 'All')
    
    const { vendor, menu, loading, error } = useVendor(id)
    const selectedCategory = searchParams.get('cat') ?? (user ? savedCategory : 'All')
    function handleSelectCategory(category) {
        if (user) setSavedCategory(category)
        if (category === 'All') {
            setSearchParams({})
        } else {
            setSearchParams({ cat: category})
        }
    }

    if (loading) return <Loading/>
    if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()}/>
    
    // const vendor = vendors.find((v) => v.id === id)

    if (!vendor) {
        return (
            <div className="card">
                <h2>Vendor not found</h2>
                <Link to="/">Back to vendors.</Link>
            </div>
        )
    }

    const categories = ['All', ...new Set(menu.map((item) => item.category))]
    const items = (selectedCategory === 'All'
        ? menu
        : menu.filter((item) => item.category === selectedCategory)
        ).map((item) => ({ ...item, vendorName:vendor.name }))

    return (
        <section>
            <p><Link to="/">← All vendors</Link></p>
            <h2 className="section-title">{vendor.name}</h2>
            <p className="muted">{vendor.location} - {vendor.openHours}</p>
            <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={handleSelectCategory}
            />
            <MenuList items={items}/>
        </section>
    )
}

export default VendorPage