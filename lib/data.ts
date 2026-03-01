export interface CustomizationOption {
  label: string
  choices: string[]
}

export interface Product {
  id: string
  name: string
  price: number
  description: string
  image: string
  category: string
  customizations: CustomizationOption[]
}

export interface CartItem {
  product: Product
  quantity: number
  selectedOptions: Record<string, string>
}

export interface Order {
  id: string
  customerId: string
  customerName: string
  customerEmail: string
  shippingAddress: string
  items: CartItem[]
  totalAmount: number
  transactionId: string
  paymentMethod: string
  // new field indicates whether a UPI payment has been approved by admin
  paymentApproved: boolean
  status: "Pending" | "Processing" | "Shipped" | "Delivered"
  date: string
}

export interface User {
  id: string
  name: string
  email: string
  role: "user" | "admin"
}

export const products: Product[] = [
  {
    id: "planner-1",
    name: "Daily Productivity Planner",
    price: 599,
    description:
      "Maximize your daily output with structured time blocks, priority lists, and gratitude journaling sections. A5 hardcover with premium paper.",
    image: "/images/planner-1.jpg",
    category: "Daily",
    customizations: [
      { label: "Size", choices: ["A5", "A4", "B5"] },
      { label: "Cover Style", choices: ["Hardcover", "Softcover", "Spiral"] },
      { label: "Page Layout", choices: ["Lined", "Dotted", "Grid", "Blank"] },
    ],
  },
  {
    id: "planner-2",
    name: "Weekly Habit Tracker",
    price: 449,
    description:
      "Build lasting habits with weekly tracking spreads, reflection prompts, and progress charts. Beige linen cover with lay-flat binding.",
    image: "/images/planner-2.jpg",
    category: "Weekly",
    customizations: [
      { label: "Size", choices: ["A5", "A4"] },
      { label: "Cover Style", choices: ["Linen", "Hardcover", "Softcover"] },
      { label: "Page Layout", choices: ["Pre-printed", "Dotted", "Grid"] },
    ],
  },
  {
    id: "planner-3",
    name: "Student Study Planner",
    price: 349,
    description:
      "Stay on top of assignments, exams, and projects with dedicated study schedules and subject trackers. Vibrant pastel design.",
    image: "/images/planner-3.jpg",
    category: "Academic",
    customizations: [
      { label: "Size", choices: ["A5", "B5"] },
      { label: "Cover Style", choices: ["Softcover", "Spiral", "Hardcover"] },
      { label: "Page Layout", choices: ["Lined", "Grid", "Mixed"] },
    ],
  },
  {
    id: "planner-4",
    name: "Minimalist Undated Planner",
    price: 299,
    description:
      "Start anytime with this clean, undated planner. Simple layouts let you customize your planning system your way.",
    image: "/images/planner-4.jpg",
    category: "Undated",
    customizations: [
      { label: "Size", choices: ["A5", "A6", "A4"] },
      { label: "Cover Style", choices: ["Hardcover", "Softcover"] },
      { label: "Page Layout", choices: ["Blank", "Dotted", "Lined"] },
    ],
  },
  {
    id: "planner-5",
    name: "Goal-Setting Vision Planner",
    price: 999,
    description:
      "Map your dreams into actionable goals with vision boards, quarterly reviews, and milestone trackers. Premium dark green hardcover with gold embossing.",
    image: "/images/planner-5.jpg",
    category: "Goals",
    customizations: [
      { label: "Size", choices: ["A4", "A5"] },
      { label: "Cover Style", choices: ["Hardcover", "Premium Leather"] },
      { label: "Page Layout", choices: ["Structured", "Dotted", "Mixed"] },
    ],
  },
]
