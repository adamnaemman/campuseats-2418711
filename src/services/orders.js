import { collection, doc, onSnapshot, query, where, serverTimestamp, writeBatch } from 'firebase/firestore'
import { db } from '../firebase.js'

export async function placeOrders(user, cart, details) {
    const byVendor = new Map()
    for (const line of cart) {
        const lines = byVendor.get(line.item.vendorId) ?? [] 
        byVendor.set(line.item.vendorId, [...lines, line])
    }
    const batch = writeBatch(db)
    for (const [vendorId, lines] of byVendor) {
        const ref = doc(collection(db, 'orders'))
        batch.set(ref, {
            studentUid: user.uid,
            studentName: details.name,
            mahallah: details.mahallah,
            pickupTime: details.pickupTime, 
            vendorId,
            vendorName: lines[0].item.vendorName,
            items: lines.map(({ item, qty }) =>  ({
                itemId: item.id, name: item.name, price: item.price, qty
            })),
            total: lines.reduce((sum, { item, qty }) => sum + item.price * qty, 0),
            status: 'Received',
            createdAt: serverTimestamp(),
        })
    }
    await batch.commit()
}

export function subscribeToMyOrders(uid, onData, onError) {
    // TODO 3: const q = query(collection(db, 'orders'), where(...))  only this student's orders
    // Hint: the field is 'studentUid' and it must equal uid. 

    const q = query(collection(db, 'orders'), where('studentUid', '==', uid))
    return onSnapshot(q, (snapshot) => {
        const orders = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
        orders.sort((a, b) => (b.createdAt?.toMillis?.()?? Date.now()) - (a.createdAt?.toMillis?.() ?? Date.now()))
        onData(orders)
    }, onError)
}