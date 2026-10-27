import MenuItemCard from './MenuItemCard.jsx'
import { useCart } from '../hooks/useCart.js'
 
function MenuList({ items, emptyMessage = 'No items on this menu yet.'}) {
  const { addToCart } = useCart()
  
  if (items.length === 0) {
    return <p className="muted">{emptyMessage}</p>
  }
 
  return (
    <div className="grid">
      {items.map((item) => (
        <MenuItemCard key={item.id} item={item} onAdd={addToCart} />
      ))}
    </div>
  )
}
 
export default MenuList