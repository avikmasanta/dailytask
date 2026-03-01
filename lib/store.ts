import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartItem, Order, Product, User } from "@/lib/data"

interface StoreState {
  // Auth
  user: User | null
  login: (email: string, password: string) => boolean
  signup: (name: string, email: string, password: string) => boolean
  adminLogin: (email: string, password: string) => boolean
  logout: () => void

  // Cart
  cart: CartItem[]
  addToCart: (product: Product, selectedOptions: Record<string, string>) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number

  // Orders
  orders: Order[]
  placeOrder: (
    customerName: string,
    customerEmail: string,
    shippingAddress: string,
    paymentMethod: string,
    transactionId?: string
  ) => Order
  updateOrderStatus: (
    orderId: string,
    status: "Pending" | "Processing" | "Shipped" | "Delivered"
  ) => void
  approvePayment: (orderId: string) => void
}

// Mock users database
const mockUsers: Array<User & { password: string }> = [
  {
    id: "admin-1",
    name: "Admin",
    email: "admin@plannermarket.com",
    role: "admin",
    password: "admin123",
  },
]

function generateTxnId(): string {
  const date = new Date()
  const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`
  const random = Math.random().toString(36).substring(2, 7).toUpperCase()
  return `TXN-${dateStr}-${random}`
}

function generateOrderId(): string {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `ORD-${random}`
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
  // Auth
  user: null,

  login: (email: string, password: string) => {
    const existingUser = mockUsers.find(
      (u) => u.email === email && u.password === password && u.role === "user"
    )
    if (existingUser) {
      const { password: _, ...userWithoutPassword } = existingUser
      set({ user: userWithoutPassword })
      return true
    }
    return false
  },

  signup: (name: string, email: string, password: string) => {
    const exists = mockUsers.find((u) => u.email === email)
    if (exists) return false
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      role: "user" as const,
      password,
    }
    mockUsers.push(newUser)
    const { password: _, ...userWithoutPassword } = newUser
    set({ user: userWithoutPassword })
    return true
  },

  adminLogin: (email: string, password: string) => {
    const admin = mockUsers.find(
      (u) => u.email === email && u.password === password && u.role === "admin"
    )
    if (admin) {
      const { password: _, ...adminWithoutPassword } = admin
      set({ user: adminWithoutPassword })
      return true
    }
    return false
  },

  logout: () => set({ user: null }),

  // Cart
  cart: [],

  addToCart: (product: Product, selectedOptions: Record<string, string>) => {
    set((state) => {
      const existing = state.cart.find((item) => item.product.id === product.id)
      if (existing) {
        return {
          cart: state.cart.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1, selectedOptions }
              : item
          ),
        }
      }
      return { cart: [...state.cart, { product, quantity: 1, selectedOptions }] }
    })
  },

  removeFromCart: (productId: string) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.product.id !== productId),
    }))
  },

  updateQuantity: (productId: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeFromCart(productId)
      return
    }
    set((state) => ({
      cart: state.cart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      ),
    }))
  },

  clearCart: () => set({ cart: [] }),

  getCartTotal: () => {
    return get().cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    )
  },

  // Orders
  orders: [],

  placeOrder: (
    customerName: string,
    customerEmail: string,
    shippingAddress: string,
    paymentMethod: string,
    transactionId?: string
  ) => {
    const state = get()
    const isUpi = paymentMethod === "UPI"
    const order: Order = {
      id: generateOrderId(),
      customerId: state.user?.id || "guest",
      customerName,
      customerEmail,
      shippingAddress,
      items: [...state.cart],
      totalAmount: state.getCartTotal(),
      transactionId: transactionId || generateTxnId(),
      paymentMethod,
      paymentApproved: !isUpi, // non-UPI is automatically approved
      status: isUpi ? "Pending" : "Processing",
      date: new Date().toISOString(),
    }
    set((state) => ({ orders: [...state.orders, order], cart: [] }))
    return order
  },

  updateOrderStatus: (
    orderId: string,
    status: "Pending" | "Processing" | "Shipped" | "Delivered"
  ) => {
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      ),
    }))
  },

  approvePayment: (orderId: string) => {
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId
          ? { ...order, paymentApproved: true, status: "Processing" }
          : order
      ),
    }))
  },
}),
    {
      name: "plannercraft-store",
      partialize: (state) => ({
        user: state.user,
        cart: state.cart,
        orders: state.orders,
      }),
    }
  )
)
