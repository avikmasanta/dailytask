"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Package, ClipboardList, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"

const statusColors: Record<string, string> = {
  Processing:
    "bg-amber-100 text-amber-800 border-amber-200",
  Shipped:
    "bg-blue-100 text-blue-800 border-blue-200",
  Delivered:
    "bg-emerald-100 text-emerald-800 border-emerald-200",
}

export default function OrdersPage() {
  const { user, orders } = useStore()

  if (!user) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-24 text-center lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
            <ClipboardList className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Please sign in
          </h1>
          <p className="text-muted-foreground">
            You need to be signed in to view your orders.
          </p>
          <Link href="/login">
            <Button className="mt-2">Sign In</Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  const userOrders = orders.filter((o) => o.customerId === user.id)

  if (userOrders.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-24 text-center lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
            <Package className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            No orders yet
          </h1>
          <p className="text-muted-foreground">
            You haven{"'"}t placed any orders yet. Start shopping to see them here.
          </p>
          <Link href="/">
            <Button className="mt-2">Browse Planners</Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 font-serif text-3xl font-bold text-foreground"
      >
        My Orders
      </motion.h1>

      <div className="flex flex-col gap-4">
        {userOrders
          .slice()
          .reverse()
          .map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <Card className="border-border transition-shadow duration-200 hover:shadow-md">
                <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-sm font-semibold text-foreground">
                        {order.id}
                      </span>
                      <Badge
                        variant="outline"
                        className={statusColors[order.status]}
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {order.items.map((i) => i.product.name).join(", ")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      {" | "} {order.paymentMethod}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-primary">
                      {"₹"}{order.totalAmount}
                    </span>
                    <Link href={`/confirmation/${order.id}`}>
                      <Button variant="outline" size="sm">
                        View
                        <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
      </div>
    </div>
  )
}
