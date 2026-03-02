"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useStore } from "@/lib/store"

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useStore()
  const total = getCartTotal()

  if (cart.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-24 text-center lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Your cart is empty
          </h1>
          <p className="max-w-sm text-muted-foreground">
            Looks like you haven{"'"}t added any planners yet. Browse our collection to find your perfect planner.
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
        Shopping Cart
      </motion.h1>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Cart Items */}
        <div className="flex-1">
          <AnimatePresence mode="popLayout">
            {cart.map((item) => (
              <motion.div
                key={item.product.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="mb-4 border-border">
                  <CardContent className="flex gap-4 p-4">
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-secondary">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h3 className="font-serif text-base font-semibold text-foreground">
                          {item.product.name}
                        </h3>

                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.quantity - 1
                              )
                            }
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium text-foreground">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.quantity + 1
                              )
                            }
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-foreground">
                            {"₹"}{item.product.price * item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => removeFromCart(item.product.id)}
                            aria-label={`Remove ${item.product.name} from cart`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:w-80"
        >
          <Card className="sticky top-24 border-border">
            <CardContent className="flex flex-col gap-4 p-6">
              <h2 className="font-serif text-lg font-semibold text-foreground">
                Order Summary
              </h2>
              <Separator />
              <div className="flex flex-col gap-2">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-muted-foreground">
                      {item.product.name} x{item.quantity}
                    </span>
                    <span className="text-foreground">
                      {"₹"}{item.product.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-foreground">
                  Total
                </span>
                <span className="text-lg font-bold text-primary">
                  {"₹"}{total}
                </span>
              </div>
              <Link href="/checkout">
                <Button className="mt-2 w-full">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
