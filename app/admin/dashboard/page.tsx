"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ShoppingBag,
  DollarSign,
  Clock,
  LogOut,
  BookOpen,
  ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useStore } from "@/lib/store"
import { toast } from "sonner"

const statusColors: Record<string, string> = {
  Pending: "bg-cyan-100 text-cyan-800 border-cyan-200",
  Processing: "bg-amber-100 text-amber-800 border-amber-200",
  Shipped: "bg-blue-100 text-blue-800 border-blue-200",
  Delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
}

export default function AdminDashboard() {
  const { user, orders, fetchOrders, updateOrderStatus, approvePayment, logout } = useStore()
  const router = useRouter()

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/admin")
    } else {
      // load latest orders from backend
      fetchOrders().catch((e) => console.error(e))
    }
  }, [user, router])

  if (!user || user.role !== "admin") {
    return null
  }

  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0)
  const pendingOrders = orders.filter((o) => o.status === "Pending").length

  const stats = [

    {
      label: "Total Orders",
      value: totalOrders,
      icon: ShoppingBag,
    },
    {
      label: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString("en-IN")}`,
      icon: DollarSign,
    },
    {
      label: "Pending Orders",
      value: pendingOrders,
      icon: Clock,
    },
  ]

  async function handleStatusChange(
    orderId: string,
    status: "Pending" | "Processing" | "Shipped" | "Delivered"
  ) {
    await updateOrderStatus(orderId, status)
    toast.success(`Order ${orderId} updated to ${status}`)
  }

  async function handleApprovePayment(orderId: string) {
    await approvePayment(orderId)
    toast.success(`Payment approved for order ${orderId}`)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="font-serif text-xl font-bold text-foreground">
                PlannerCraft
              </span>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <span className="text-sm font-medium text-muted-foreground">
              Admin Dashboard
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Store
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                logout()
                router.push("/admin")
              }}
            >
              <LogOut className="mr-1 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-border">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-border">
            <CardContent className="p-0">
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <h2 className="font-serif text-lg font-semibold text-foreground">
                  All Orders
                </h2>
                <span className="text-sm text-muted-foreground">
                  {totalOrders} {totalOrders === 1 ? "order" : "orders"}
                </span>
              </div>

              {orders.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-16 text-center">
                  <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    No orders yet. They will appear here once customers place orders.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Email
                        </TableHead>
                        <TableHead className="hidden lg:table-cell">
                          Items
                        </TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Transaction ID
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Date
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden sm:table-cell">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders
                        .slice()
                        .reverse()
                        .map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-mono text-xs font-semibold">
                              {order.id}
                            </TableCell>
                            <TableCell className="text-sm">
                              {order.customerName}
                            </TableCell>
                            <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                              {order.customerEmail}
                            </TableCell>
                            <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
                              {order.items
                                .map(
                                  (i) => `${i.product.name} (x${i.quantity})`
                                )
                                .join(", ")}
                            </TableCell>
                            <TableCell className="font-semibold text-primary">
                              {"₹"}{order.totalAmount}
                            </TableCell>
                            <TableCell className="hidden font-mono text-xs text-muted-foreground sm:table-cell">
                              {order.transactionId}
                            </TableCell>
                            <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                              {new Date(order.date).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                }
                              )}
                            </TableCell>
                            <TableCell>
                              <Select
                                value={order.status}
                                onValueChange={(value) =>
                                  handleStatusChange(
                                    order.id,
                                    value as
                                      | "Pending"
                                      | "Processing"
                                      | "Shipped"
                                      | "Delivered"
                                  )
                                }
                              >
                                <SelectTrigger className="h-8 w-32">
                                  <Badge
                                    variant="outline"
                                    className={`${statusColors[order.status]} text-xs`}
                                  >
                                    <SelectValue />
                                  </Badge>
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Pending">
                                    Pending
                                  </SelectItem>
                                  <SelectItem value="Processing">
                                    Processing
                                  </SelectItem>
                                  <SelectItem value="Shipped">
                                    Shipped
                                  </SelectItem>
                                  <SelectItem value="Delivered">
                                    Delivered
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              {order.paymentMethod === "UPI" && !order.paymentApproved ? (
                                <Button
                                  size="sm"
                                  onClick={() => handleApprovePayment(order.id)}
                                  className="h-7 w-20"
                                >
                                  Approve Pay
                                </Button>
                              ) : order.paymentMethod === "UPI" ? (
                                <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs">
                                  Approved
                                </Badge>
                              ) : (
                                <span className="text-xs text-muted-foreground">—</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
