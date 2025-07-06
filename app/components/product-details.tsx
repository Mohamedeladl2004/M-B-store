"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import axios from "axios"
import { Star, ShoppingCart, ArrowLeft, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "../contexts/cart-context"

interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: {
    rate: number
    count: number
  }
}

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>()
  const { addToCart } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`https://fakestoreapi.com/products/${id}`)
        setProduct(response.data)
      } catch (err) {
        setError("Failed to fetch product details")
        console.error("Error fetching product:", err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-4">{error || "The product you are looking for does not exist."}</p>
          <Link to="/">
            <Button className="bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white rounded-xl">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (product) {
      addToCart(
        {
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
        },
        quantity,
      )
      setAddedToCart(true)
      setTimeout(() => setAddedToCart(false), 2000)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link to="/">
          <Button
            variant="ghost"
            className="flex items-center space-x-2 text-gray-600 hover:text-sky-600 hover:bg-sky-50 rounded-xl"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Products</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-lg border border-sky-100">
          <img src={product.image || "/placeholder.svg"} alt={product.title} className="w-full h-full object-contain" />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Badge variant="secondary" className="mb-2 capitalize bg-sky-100 text-sky-700 rounded-full">
              {product.category}
            </Badge>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.title}</h1>

            {/* Rating */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating.rate) ? "text-amber-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating.rate} ({product.rating.count} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="text-3xl font-bold text-sky-600 mb-6">${product.price.toFixed(2)}</div>
          </div>

          {/* Description */}
          <div className="bg-sky-50 p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center space-x-4">
            <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
              Quantity:
            </label>
            <div className="flex items-center border border-sky-200 rounded-xl bg-white">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-gray-600 hover:bg-sky-50 rounded-l-xl transition-colors"
              >
                -
              </button>
              <span className="px-4 py-2 border-x border-sky-200 font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 text-gray-600 hover:bg-sky-50 rounded-r-xl transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl py-3"
              size="lg"
              disabled={addedToCart}
            >
              <ShoppingCart className="h-5 w-5" />
              <span>{addedToCart ? "Added to Cart!" : "Add to Cart"}</span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex items-center justify-center space-x-2 border-sky-200 text-sky-600 hover:bg-sky-50 hover:border-sky-300 rounded-xl bg-transparent"
            >
              <Heart className="h-5 w-5" />
              <span>Add to Wishlist</span>
            </Button>
          </div>

          {/* Additional Info */}
          <div className="border-t border-sky-100 pt-6 space-y-2 text-sm text-gray-600">
            <p>• Free shipping on orders over $50</p>
            <p>• 30-day return policy</p>
            <p>• Secure payment processing</p>
          </div>
        </div>
      </div>
    </div>
  )
}
