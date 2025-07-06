"use client"

import { useState, useRef, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { ShoppingBag, Menu, X, ChevronDown, User, LogOut } from "lucide-react"
import { useUser } from "../contexts/user-context"
import { useCart } from "../contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const categories = [
  { name: "Men's Clothing", path: "/category/men's clothing" },
  { name: "Women's Clothing", path: "/category/women's clothing" },
  { name: "Electronics", path: "/category/electronics" },
  { name: "Jewelry", path: "/category/jewelery" },
]

export default function Navigation() {
  const location = useLocation()
  const { user, logout, isLoggedIn } = useUser()
  const { getTotalItems } = useCart()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const isActive = (path: string) => location.pathname === path

  const totalItems = getTotalItems()

  // Handle dropdown hover with delay
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsCategoriesOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsCategoriesOpen(false)
    }, 150)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoriesOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-sky-100 via-sky-50 to-blue-100 backdrop-blur-md shadow-lg border-b border-sky-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-white p-2.5 rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300 border border-sky-200/50">
              <div className="bg-gradient-to-br from-sky-500 to-blue-600 p-1.5 rounded-lg">
                <ShoppingBag className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-800 group-hover:text-sky-700 transition-colors">
                M&B Store
              </span>
              <span className="text-xs text-sky-600 hidden sm:block font-medium">Quality Shopping</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              to="/"
              className={`relative text-sm font-semibold transition-all duration-300 hover:text-sky-700 px-3 py-2 rounded-lg hover:bg-white/50 ${
                isActive("/") ? "text-sky-700 bg-white/60 shadow-sm" : "text-gray-700"
              }`}
            >
              Home
              {isActive("/") && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-sky-600 rounded-full" />
              )}
            </Link>

            {/* Categories Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="flex items-center space-x-1 text-sm font-semibold text-gray-700 hover:text-sky-700 transition-all duration-300 px-3 py-2 rounded-lg hover:bg-white/50 group"
              >
                <span>Categories</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 ${isCategoriesOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown Menu */}
              <div
                className={`absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-sky-100 py-2 z-50 transition-all duration-300 transform ${
                  isCategoriesOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-2 invisible"
                }`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="py-1">
                  {categories.map((category, index) => (
                    <Link
                      key={category.name}
                      to={category.path}
                      onClick={() => setIsCategoriesOpen(false)}
                      className={`block px-4 py-3 text-sm text-gray-700 hover:bg-sky-50 hover:text-sky-700 transition-all duration-200 font-medium ${
                        index !== categories.length - 1 ? "border-b border-sky-50" : ""
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-sky-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span>{category.name}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Add Offers Link */}
            <Link
              to="/offers"
              className={`relative text-sm font-semibold transition-all duration-300 hover:text-sky-700 px-3 py-2 rounded-lg hover:bg-white/50 ${
                isActive("/offers") ? "text-sky-700 bg-white/60 shadow-sm" : "text-gray-700"
              }`}
            >
              Offers
              {isActive("/offers") && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-sky-600 rounded-full" />
              )}
            </Link>

            {/* Cart Link */}
            <Link
              to="/cart"
              className={`relative flex items-center space-x-2 text-sm font-semibold transition-all duration-300 hover:text-sky-700 px-3 py-2 rounded-lg hover:bg-white/50 ${
                isActive("/cart") ? "text-sky-700 bg-white/60 shadow-sm" : "text-gray-700"
              }`}
            >
              <span className="text-lg">🛒</span>
              <span>Cart</span>
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white border-2 border-white shadow-md animate-pulse">
                  {totalItems}
                </Badge>
              )}
              {isActive("/cart") && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-sky-600 rounded-full" />
              )}
            </Link>

            {/* Auth Links */}
            {!isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className={`text-sm font-semibold transition-all duration-300 hover:text-sky-700 px-4 py-2 rounded-lg hover:bg-white/50 ${
                    isActive("/login") ? "text-sky-700 bg-white/60 shadow-sm" : "text-gray-700"
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-4 py-2 bg-white/60 rounded-lg shadow-sm border border-sky-200/50">
                  <User className="h-4 w-4 text-sky-600" />
                 {user && (
  <span className="text-sm text-gray-700 font-medium">Welcome, {user.name}</span>
)}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-300"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-3">
            {/* Mobile Cart */}
            <Link to="/cart" className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="relative bg-white/60 hover:bg-white/80 text-sky-700 rounded-lg shadow-sm border border-sky-200/50"
              >
                <span className="text-lg">🛒</span>
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs bg-red-500 text-white border border-white">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Hamburger Menu */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-sky-700 hover:bg-white/50 rounded-lg transition-all duration-300"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden border-t border-sky-200/50 bg-gradient-to-r from-sky-50 to-blue-50 transition-all duration-300 ${
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-3 text-base font-semibold rounded-lg transition-all duration-300 ${
                isActive("/")
                  ? "text-sky-700 bg-white/60 shadow-sm"
                  : "text-gray-700 hover:text-sky-700 hover:bg-white/50"
              }`}
            >
              Home
            </Link>

            {/* Add Mobile Offers Link */}
            <Link
              to="/offers"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-3 text-base font-semibold rounded-lg transition-all duration-300 ${
                isActive("/offers")
                  ? "text-sky-700 bg-white/60 shadow-sm"
                  : "text-gray-700 hover:text-sky-700 hover:bg-white/50"
              }`}
            >
              Offers
            </Link>

            {/* Mobile Categories */}
            <div className="px-4 py-2">
              <span className="text-base font-semibold text-gray-700 mb-2 block">Categories</span>
              <div className="ml-4 space-y-1">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    to={category.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm text-gray-600 hover:text-sky-700 hover:bg-white/50 rounded-lg transition-all duration-300 font-medium"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t border-sky-200/50 pt-2 mt-2">
              {!isLoggedIn ? (
                <div className="space-y-1">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 text-base font-semibold text-gray-700 hover:text-sky-700 hover:bg-white/50 rounded-lg transition-all duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 text-base font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-600 rounded-lg shadow-md mx-2"
                  >
                    Register
                  </Link>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="px-4 py-3 text-base font-semibold text-gray-700 bg-white/60 rounded-lg mx-2 shadow-sm">
                   {user && (
  <span className="text-sm text-gray-700 font-medium">Welcome, {user.name}</span>
)}
                  </div>
                  <button
                    onClick={() => {
                      logout()
                      setIsMobileMenuOpen(false)
                    }}
                    className="block w-full text-left px-4 py-3 text-base font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 mx-2"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
