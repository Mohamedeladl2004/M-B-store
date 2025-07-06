"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { Star, Eye, Tag, Zap, Clock, FlameIcon as Fire } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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

interface OfferProduct extends Product {
  originalPrice: number
  discountPercentage: number
  offerType: "flash" | "weekend" | "clearance" | "hot"
  timeLeft?: string
}

export default function Offers() {
  const [products, setProducts] = useState<Product[]>([])
  const [offerProducts, setOfferProducts] = useState<OfferProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://fakestoreapi.com/products")
        const fetchedProducts = response.data

        // Create offer products with discounts
        const offersData: OfferProduct[] = fetchedProducts
          .slice(0, 6) // Take first 6 products for offers (changed from 12)
          .map((product: Product, index: number) => {
            const discounts = [10, 15, 20, 25, 30, 35, 40, 45, 50]
            const offerTypes: ("flash" | "weekend" | "clearance" | "hot")[] = ["flash", "weekend", "clearance", "hot"]
            const timeLeftOptions = ["2h 30m", "5h 15m", "1d 12h", "3h 45m", "6h 20m"]

            const discountPercentage = discounts[index % discounts.length]
            const originalPrice = product.price
            const discountedPrice = originalPrice * (1 - discountPercentage / 100)
            const offerType = offerTypes[index % offerTypes.length]

            return {
              ...product,
              price: Math.round(discountedPrice * 100) / 100,
              originalPrice,
              discountPercentage,
              offerType,
              timeLeft: offerType === "flash" ? timeLeftOptions[index % timeLeftOptions.length] : undefined,
            }
          })

        setProducts(fetchedProducts)
        setOfferProducts(offersData)
      } catch (err) {
        setError("Failed to fetch offers")
        console.error("Error fetching offers:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const getOfferBadge = (offer: OfferProduct) => {
    const badgeConfig = {
      flash: { icon: Zap, color: "bg-gradient-to-r from-yellow-400 to-orange-500", text: "Flash Sale" },
      weekend: { icon: Tag, color: "bg-gradient-to-r from-purple-400 to-pink-500", text: "Weekend Deal" },
      clearance: { icon: Fire, color: "bg-gradient-to-r from-red-400 to-red-600", text: "Clearance" },
      hot: { icon: Fire, color: "bg-gradient-to-r from-orange-400 to-red-500", text: "Hot Deal" },
    }

    const config = badgeConfig[offer.offerType]
    const Icon = config.icon

    return (
      <Badge className={`${config.color} text-white border-0 shadow-lg flex items-center space-x-1 animate-pulse`}>
        <Icon className="h-3 w-3" />
        <span className="text-xs font-bold">{config.text}</span>
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading amazing offers...</p>
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="bg-gradient-to-r from-sky-100 via-blue-50 to-purple-100 rounded-3xl p-8 mb-8 shadow-xl border border-sky-200/50">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-3 rounded-xl shadow-lg mr-3">
              <Tag className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">Special Offers</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Don't miss out on these incredible deals! Limited time offers with up to 50% off
          </p>
          <div className="flex items-center justify-center mt-4 space-x-4">
            <Badge className="bg-gradient-to-r from-red-400 to-red-600 text-white px-4 py-2 text-sm animate-bounce">
              <Fire className="h-4 w-4 mr-1" />
              Hot Deals
            </Badge>
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 text-sm animate-pulse">
              <Zap className="h-4 w-4 mr-1" />
              Flash Sales
            </Badge>
          </div>
        </div>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {offerProducts.map((product) => (
          <Card
            key={product.id}
            className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white rounded-2xl overflow-hidden relative transform hover:scale-105"
          >
            {/* Offer Badge */}
            <div className="absolute top-3 left-3 z-10">{getOfferBadge(product)}</div>

            {/* Discount Badge */}
            <div className="absolute top-3 right-3 z-10">
              <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white border-0 shadow-lg font-bold text-sm">
                -{product.discountPercentage}%
              </Badge>
            </div>

            {/* Flash Sale Timer */}
            {product.offerType === "flash" && product.timeLeft && (
              <div className="absolute top-12 right-3 z-10">
                <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-lg flex items-center space-x-1 animate-pulse">
                  <Clock className="h-3 w-3" />
                  <span className="text-xs font-bold">{product.timeLeft}</span>
                </Badge>
              </div>
            )}

            <CardContent className="p-4">
              <div className="aspect-square mb-4 overflow-hidden rounded-xl bg-gradient-to-br from-sky-50 to-blue-50 border-2 border-sky-100">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.title}
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
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

                {/* Price Section */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-green-600">${product.price.toFixed(2)}</span>
                      <span className="text-sm text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
                    </div>
                    <span className="text-xs text-gray-500 capitalize bg-sky-50 px-2 py-1 rounded-full border border-sky-200">
                      {product.category}
                    </span>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-2 rounded-lg border border-green-200">
                    <p className="text-xs text-green-700 font-semibold text-center">
                      You Save: ${(product.originalPrice - product.price).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="p-4 pt-0">
              <Link to={`/product/${product.id}`} className="w-full">
                <Button className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl font-semibold">
                  <Eye className="h-4 w-4 mr-2" />
                  Grab This Deal
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Bottom CTA Section */}
      <div className="mt-16 text-center">
        <div className="bg-gradient-to-r from-sky-100 to-blue-100 rounded-2xl p-8 shadow-lg border border-sky-200/50">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Don't Miss Out!</h2>
          <p className="text-gray-600 mb-6">
            These offers won't last long. Shop now and save big on your favorite products!
          </p>
          <Link to="/">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold">
              Browse All Products
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
