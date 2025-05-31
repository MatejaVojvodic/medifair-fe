import { useContext } from "react"
import { ProductContext } from "../context/ProductContext"
import "../assets/styles/product.css"

const ProductFilter = () => {
  const { filters, setFilters, applyFilters, loadProducts } = useContext(ProductContext)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFilters({
      ...filters,
      [name]: value,
    })
  }

  const handleApplyFilters = () => {
    applyFilters()
  }

  const handleClearFilters = () => {
    setFilters({
      name: "",
      minPrice: "",
      maxPrice: "",
      minQuantity: "",
      maxQuantity: "",
    })
    loadProducts() // Load all products when clearing filters
  }

  return (
    <div className="filter-container">
      <h3 className="filter-title">Filter Products</h3>
      <div className="filter-form">
        <div className="filter-group">
          <label htmlFor="name" className="filter-label">
            Product Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={filters.name}
            onChange={handleChange}
            placeholder="Search by name..."
            className="filter-control"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="minPrice" className="filter-label">
            Min Price ($)
          </label>
          <input
            type="number"
            id="minPrice"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleChange}
            placeholder="0.00"
            min="0"
            step="0.01"
            className="filter-control"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="maxPrice" className="filter-label">
            Max Price ($)
          </label>
          <input
            type="number"
            id="maxPrice"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleChange}
            placeholder="999.99"
            min="0"
            step="0.01"
            className="filter-control"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="minQuantity" className="filter-label">
            Min Quantity
          </label>
          <input
            type="number"
            id="minQuantity"
            name="minQuantity"
            value={filters.minQuantity}
            onChange={handleChange}
            placeholder="0"
            min="0"
            className="filter-control"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="maxQuantity" className="filter-label">
            Max Quantity
          </label>
          <input
            type="number"
            id="maxQuantity"
            name="maxQuantity"
            value={filters.maxQuantity}
            onChange={handleChange}
            placeholder="1000"
            min="0"
            className="filter-control"
          />
        </div>

        <div className="filter-actions">
          <button onClick={handleApplyFilters} className="btn btn-primary">
            Apply Filters
          </button>
          <button onClick={handleClearFilters} className="btn btn-secondary">
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductFilter
