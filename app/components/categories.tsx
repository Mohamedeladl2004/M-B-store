"use client"

import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import axios from "axios"
import { Star, Eye, Grid3X3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

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

const categories = [
  {
    name: "Men's Clothing",
    key: "men's clothing",
    icon: "👔",
    color: "from-blue-400 to-cyan-400",
    bgColor: "from-blue-50 to-cyan-50",
  },
  {
    name: "Women's Clothing",
    key: "women's clothing",
    icon: "👗",
    color: "from-pink-400 to-rose-400",
    bgColor: "from-pink-50 to-rose-50",
  },
  {
    name: "Electronics",
    key: "electronics",
    icon: "📱",
    color: "from-purple-400 to-indigo-400",
    bgColor: "from-purple-50 to-indigo-50",
  },
  {
    name: "Jewelry",
    key: "jewelery",
    icon: "💎",
    color: "from-amber-400 to-orange-400",
    bgColor: "from-amber-50 to-orange-50",
  },
]

export default function Categories() {
  const { category } = useParams<{ category: string }>()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://fakestoreapi.com/products")
        setProducts(response.data)
      } catch (err) {
        setError("Failed to fetch products")
        console.error("Error fetching products:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const getProductsByCategory = (categoryKey: string) => {
    return products.filter((product) => product.category.toLowerCase() === categoryKey.toLowerCase())
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  // If specific category is selected, show only that category
  if (category) {
    const selectedCategory = categories.find((cat) => cat.key === category)
    const categoryProducts = getProductsByCategory(category)

    if (!selectedCategory) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Category Not Found</h2>
            <Link to="/categories">
              <Button className="bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white rounded-xl">
                View All Categories
              </Button>
            </Link>
          </div>
        </div>
      )
    }

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Header */}
        <div className={`bg-gradient-to-r ${selectedCategory.bgColor} rounded-2xl p-8 mb-8 shadow-lg`}>
          <div className="flex items-center space-x-4">
            <div className={`bg-gradient-to-r ${selectedCategory.color} p-4 rounded-xl shadow-lg`}>
              <span className="text-3xl">{selectedCategory.icon}</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{selectedCategory.name}</h1>
              <p className="text-gray-600 mt-2">
                {categoryProducts.length} {categoryProducts.length === 1 ? "product" : "products"} available
              </p>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categoryProducts.map((product) => (
            <Card
              key={product.id}
              className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white rounded-2xl overflow-hidden"
            >
              <CardContent className="p-4">
                <div className="aspect-square mb-4 overflow-hidden rounded-xl bg-sky-50">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.title}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-800 line-clamp-2 text-sm leading-relaxed">{product.title}</h3>

                  <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed">{product.description}</p>

                  <div className="flex items-center space-x-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(product.rating.rate) ? "text-amber-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">({product.rating.count})</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-sky-600">${product.price.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0">
                <Link to={`/product/${product.id}`} className="w-full">
                  <Button className="w-full bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Show all categories
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <Grid3X3 className="h-8 w-8 text-sky-600 mr-3" />
          <h1 className="text-4xl font-bold text-gray-800">Shop by Categories</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover our carefully curated collections across different categories
        </p>
      </div>

      {/* Categories */}
      <div className="space-y-16">
        {categories.map((categoryInfo) => {
          const categoryProducts = getProductsByCategory(categoryInfo.key)

          if (categoryProducts.length === 0) return null

          return (
            <section key={categoryInfo.key} className="space-y-6">
              {/* Category Header */}
              <div className={`bg-gradient-to-r ${categoryInfo.bgColor} rounded-2xl p-6 shadow-lg`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`bg-gradient-to-r ${categoryInfo.color} p-3 rounded-xl shadow-lg`}>
                      <span className="text-2xl">{categoryInfo.icon}</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">{categoryInfo.name}</h2>
                      <p className="text-gray-600">
                        {categoryProducts.length} {categoryProducts.length === 1 ? "product" : "products"} available
                      </p>
                    </div>
                  </div>
                  <Link to={`/category/${categoryInfo.key}`}>
                    <Button
                      variant="outline"
                      className="border-sky-200 text-sky-600 hover:bg-sky-50 hover:border-sky-300 rounded-xl bg-transparent"
                    >
                      View All
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categoryProducts.slice(0, 4).map((product) => (
                  <Card
                    key={product.id}
                    className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white rounded-2xl overflow-hidden"
                  >
                    <CardContent className="p-4">
                      <div className="aspect-square mb-4 overflow-hidden rounded-xl bg-sky-50">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.title}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div className="space-y-3">
                        <h3 className="font-semibold text-gray-800 line-clamp-2 text-sm leading-relaxed">
                          {product.title}
                        </h3>

                        <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed">{product.description}</p>

                        <div className="flex items-center space-x-1">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < Math.floor(product.rating.rate) ? "text-amber-400 fill-current" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">({product.rating.count})</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-sky-600">${product.price.toFixed(2)}</span>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="p-4 pt-0">
                      <Link to={`/product/${product.id}`} className="w-full">
                        <Button className="w-full bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
