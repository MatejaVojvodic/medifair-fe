import { useContext } from "react";
import { ProductContext } from "../context/ProductContext";

const ProductFilter = () => {
  const { filters, setFilters, applyFilters } = useContext(ProductContext);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h3>Filter Products</h3>
      <input type="text" name="name" value={filters.name} onChange={handleChange} placeholder="Name" />
      <input type="number" name="minPrice" value={filters.minPrice} onChange={handleChange} placeholder="Min Price" />
      <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleChange} placeholder="Max Price" />
      <input type="number" name="minQuantity" value={filters.minQuantity} onChange={handleChange} placeholder="Min Quantity" />
      <input type="number" name="maxQuantity" value={filters.maxQuantity} onChange={handleChange} placeholder="Max Quantity" />
      <button onClick={applyFilters}>Apply Filters</button>
    </div>
  );
};

export default ProductFilter;