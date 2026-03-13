import { Routes, Route } from "react-router-dom"
import { Home } from "./pages/Home"
import { CatalogPage } from "./pages/CatalogPage"
import { CategoryPage } from "./pages/CategoryPage"
import { ProductPage } from "./pages/ProductPage"
import { AdminPage } from "./pages/AdminPage"
import { LoginPage } from "./pages/LoginPage"
import { AuthProvider } from "./lib/auth"
import { ProtectedRoute } from "./components/ProtectedRoute"

export default function App() {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  )
}
