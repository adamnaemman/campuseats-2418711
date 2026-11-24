import { useEffect, useState } from 'react'
import { subscribeToVendor, subscribeToMenuByCategory } from '../services/vendors.js'

export function useVendor(vendorId, category = 'All') {
    const [vendor, setVendor] = useState(undefined) 
    const [menu, setMenu] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {
        return subscribeToVendor(vendorId, setVendor, (err) => setError(err.message))
    }, [vendorId])

    useEffect(() => {
        return subscribeToMenuByCategory(vendorId, category, setMenu, (err) => setError(err.message))
    }, [vendorId, category])

    return {vendor, menu, loading: vendor === undefined && !error, error}
}

