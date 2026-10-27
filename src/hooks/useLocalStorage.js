import { useEffect, useState } from 'react'

export function useLocalStorage(key, initialValue) {

    //Lazy initialization
    const [value, setValue] = useState(() => {
        try {
            const saved = localStorage.getItem(key)
            return saved !== null ? JSON.parse(saved) : initialValue
        } catch {
            return initialValue
        }
    })

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value))
        } catch (err) {
            console.warn(`useLocalStorage: could not save "${key}"`, err)
        }
    }, [key, value])
    
    return [value, setValue]
}