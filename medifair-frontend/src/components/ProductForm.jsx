import { useState, useEffect } from "react"
import "../assets/styles/product.css"

const ProductForm = ({ onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || "",
    quantity: initialData?.quantity || "",
    imageUrl: initialData?.imageUrl || "",
    imageUrls: initialData?.imageUrls || [],
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewUrl, setPreviewUrl] = useState("")

  // Set preview URL from initial data
  useEffect(() => {
    if (initialData?.imageUrl) {
      setPreviewUrl(initialData.imageUrl)
    } else if (initialData?.imageUrls && initialData.imageUrls.length > 0) {
      setPreviewUrl(initialData.imageUrls[0])
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Update preview for image URL
    if (name === "imageUrl") {
      setPreviewUrl(value)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Prepare image URLs array
      const imageUrlsArray = []

      // If imageUrl is provided, add it to the array
      if (formData.imageUrl && formData.imageUrl.trim() !== "") {
        imageUrlsArray.push(formData.imageUrl.trim())
      }

      // Add any existing imageUrls that aren't the same as imageUrl
      if (Array.isArray(formData.imageUrls)) {
        formData.imageUrls.forEach((url) => {
          if (url !== formData.imageUrl && url.trim() !== "") {
            imageUrlsArray.push(url)
          }
        })
      }

      const productData = {
        ...formData,
        price: Number.parseFloat(formData.price),
        quantity: Number.parseInt(formData.quantity),
        imageUrls: imageUrlsArray,
      }

      await onSubmit(productData)
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isValidImageUrl = (url) => {
    return url && url.trim() !== ""
  }

  return (
    <div className="product-form-container">
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="name">Product Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-control"
            placeholder="Enter product name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="form-control"
            placeholder="Enter product description"
            rows="4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="imageUrl">Image URL</label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="form-control"
            placeholder="https://example.com/image.jpg"
          />
          {isValidImageUrl(previewUrl) && (
            <div className="image-preview">
              <p>Image Preview:</p>
              <img
                src={previewUrl || "/placeholder.svg"}
                alt="Product preview"
                className="preview-img"
                onError={(e) => {
                  console.error("Image failed to load:", previewUrl)
                  e.target.src = "https://via.placeholder.com/200x150?text=Image+Not+Found"
                }}
              />
            </div>
          )}
          <small className="form-text text-muted">
            For best results, use image URLs from Unsplash or other image hosting services.
          </small>
        </div>

        <div className="form-row">
          <div className="col">
            <div className="form-group">
              <label htmlFor="price">Price ($)</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="form-control"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="col">
            <div className="form-group">
              <label htmlFor="quantity">Quantity</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                min="0"
                className="form-control"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={isSubmitting} className="btn btn-primary">
            {isSubmitting ? "Saving..." : initialData ? "Update Product" : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProductForm
