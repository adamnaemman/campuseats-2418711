import { useEffect, useState } from 'react'

const VENDORS_URL = '/api/vendors.json'

export function useVendors() {
    const [vendors, setVendors] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [reloadKey, setReloadKey] = useState(0)

    useEffect(() => {
        const controller = new AbortController() 
    
        async function loadVendors() { 
          try {
            setLoading(true)
            setError(null)
            const response = await fetch(VENDORS_URL, { signal: controller.signal })
            if (!response.ok) throw new Error(`HTTP ${response.status}`)
            setVendors(await response.json())
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

      function reload() {
        setReloadKey((key) => key +1 )
      }

      return { vendors, loading, error, reload }
}