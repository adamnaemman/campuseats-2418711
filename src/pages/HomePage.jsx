import VendorCard from '../components/VendorCard.jsx'
import { Loading, ErrorMessage } from '../components/Status.jsx'
import { useVendors } from '../hooks/useVendors.js'

function HomePage() {
    const { vendors, loading, error, reload } = useVendors()

    if (loading) return <Loading />
    if (error) return <ErrorMessage message={error} onRetry={reload} />
    if (vendors.length === 0) return <p className="muted">No vendors have opened yet.</p>

    return (
        <section>
            <h2 className="section-title">Choose a vendor</h2>
            <div className="vendor-grid">
                {vendors.map((vendor) => (
                    <VendorCard key={vendor.id} vendor={vendor} />
                ))}
            </div>
        </section>
    )
}

export default HomePage