"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  CreditCard,
  Smartphone,
  Landmark,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useStore } from "@/lib/store"
import { toast } from "sonner"

const paymentMethods = [
  { value: "UPI", label: "UPI", icon: Smartphone },
  { value: "Card", label: "Credit / Debit Card", icon: CreditCard },
  { value: "Net Banking", label: "Net Banking", icon: Landmark },
]

export default function CheckoutPage() {
  const { cart, getCartTotal, placeOrder, user } = useStore()
  const router = useRouter()
  const total = getCartTotal()

  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [address, setAddress] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("UPI")
  const [upiTxnId, setUpiTxnId] = useState("") // user-entered UPI transaction ID
  const [loading, setLoading] = useState(false)

  if (cart.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-24 text-center lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Nothing to checkout
          </h1>
          <p className="text-muted-foreground">
            Add some planners to your cart first.
          </p>
          <Link href="/">
            <Button className="mt-2">Browse Planners</Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !email || !address) {
      toast.error("Please fill in all fields")
      return
    }

    if (paymentMethod === "UPI" && !upiTxnId.trim()) {
      toast.error("Please enter the transaction ID after paying.")
      return
    }

    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    const order = placeOrder(name, email, address, paymentMethod, upiTxnId || undefined)
    setLoading(false)
    toast.success("Order placed successfully! Please wait for admin approval if using UPI.")
    router.push(`/confirmation/${order.id}`)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <Link
        href="/cart"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Cart
      </Link>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 font-serif text-3xl font-bold text-foreground"
      >
        Checkout
      </motion.h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-8 lg:flex-row"
      >
        {/* Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1"
        >
          <Card className="border-border">
            <CardContent className="flex flex-col gap-6 p-6">
              <h2 className="font-serif text-lg font-semibold text-foreground">
                Shipping Details
              </h2>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="checkout-name">Full Name</Label>
                  <Input
                    id="checkout-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="checkout-email">Email</Label>
                  <Input
                    id="checkout-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="checkout-address">Shipping Address</Label>
                  <Input
                    id="checkout-address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Full shipping address"
                    required
                  />
                </div>
              </div>

              <Separator />

              <h2 className="font-serif text-lg font-semibold text-foreground">
                Payment Method
              </h2>
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="flex flex-col gap-3"
              >
                {paymentMethods.map((method) => (
                  <label
                    key={method.value}
                    htmlFor={`pay-${method.value}`}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                      paymentMethod === method.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <RadioGroupItem
                      value={method.value}
                      id={`pay-${method.value}`}
                    />
                    <method.icon className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">
                      {method.label}
                    </span>
                  </label>
                ))}
              </RadioGroup>

              {paymentMethod === "UPI" && (
                <div className="mt-6 flex flex-col items-center gap-4">
                  <p className="text-sm text-muted-foreground">
                    Scan the QR code below with your UPI app and complete the payment.
                  </p>
                  <img
                    src="/images/upi-qr.png"
                    alt="UPI QR Code"
                    className="h-40 w-40"
                  />
                  <div className="w-full max-w-xs">
                    <Label htmlFor="upi-txn">Transaction ID</Label>
                    <Input
                      id="upi-txn"
                      placeholder="Enter transaction ID"
                      value={upiTxnId}
                      onChange={(e) => setUpiTxnId(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Summary */}
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
              <Button type="submit" className="mt-2 w-full" disabled={loading}>
                {loading ? "Processing..." : `Pay ₹${total}`}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </form>
    </div>
  )
}
