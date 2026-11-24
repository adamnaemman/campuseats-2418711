import  { collection, doc, onSnapshot, writeBatch } from 'firebase/firestore'
import { db } from '../firebase.js'

// Hierarchy: Collection -> Document
export function subscribeToVendors(onData, onError) { 
    return onSnapshot(
        collection(db, 'vendors'),
        (snapshot) => onData(
            snapshot.docs
                .map((d) => ({id: d.id, ...d.data() }))
                .sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99)),
        ),
        onError,
    )
}

export function subscribeToVendor(vendorId, onData, onError) {
    return onSnapshot(
        doc(db, 'vendors', vendorId), 
        (snap) => onData(snap.exists() ? { id: snap.id, ...snap.data() } : null),
        onError,
    )
}

export function subscribeToMenu(vendorId, onData, onError) {
    return onSnapshot(
        collection(db, 'vendors', vendorId, 'menu'),
        (snapshot) => onData(snapshot.docs.map((d) => ({ id: d.id, vendorId, ...d.data() }))),
        onError,
    )
}

export async function seedDemoData(vendors) {
    const batch = writeBatch(db)
    for (const { menu, id, ...vendor } of vendors) {
        batch.set(doc(db, 'vendors', id), vendor)
        for (const { id: itemId, ...item } of menu) {
            batch.set(doc(db, 'vendors', id, 'menu', itemId), item)
        }
    }
    await batch.commit()
}