function CategoryFilter({ categories, selectedCategory, onSelectCategory }) {
    return (
        <div className="category-filter">
            {categories.map((category) => (
                <button 
                    key={category} 
                    type="button" 
                    className={selectedCategory === category ? 'category-btn active' : 'category-btn'} 
                    onClick={() => {
                        console.log('Selected category:', category)
                        if (onSelectCategory) {
                            onSelectCategory(category)
                        }
                    }}
                >
                    {category}
                </button>
            ))}
        </div>
    )
}

export default CategoryFilter