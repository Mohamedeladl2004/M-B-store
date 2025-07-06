"use client"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { UserProvider } from "./contexts/user-context"
import { CartProvider } from "./contexts/cart-context"
import Navigation from "./components/navigation"
import Homepage from "./components/homepage"
import ProductDetails from "./components/product-details"
import Login from "./components/login"
import Register from "./components/register"
import Cart from "./components/cart"
import Categories from "./components/categories"
import Offers from "./components/offers"

export default function App() {
  return (
    <UserProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50">
            <Navigation />
            <main className="pt-20">
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/offers" element={<Offers />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/category/:category" element={<Categories />} />
              </Routes>
            </main>
          </div>
        </Router>
      </CartProvider>
    </UserProvider>
  )
}
