"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  CheckCircle2,
  Download,
  ArrowLeft,
  Copy,
  Package,
  Clock,
} from "lucide-react"
import QRCode from "qrcode"
import { jsPDF } from "jspdf"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useStore } from "@/lib/store"
import { toast } from "sonner"

export default function ConfirmationPage() {
  const params = useParams()
  const orderId = params.orderId as string
  const { orders } = useStore()
  const order = orders.find((o) => o.id === orderId)
  const [qrDataUrl, setQrDataUrl] = useState<string>("")
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (order) {
      QRCode.toDataURL(order.transactionId, {
        width: 200,
        margin: 2,
        color: { dark: "#1a1a1a", light: "#ffffff" },
      }).then(setQrDataUrl)
    }
  }, [order])

  const downloadReceipt = useCallback(() => {
    if (!order) return
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()

    // Header
    doc.setFontSize(22)
    doc.setFont("helvetica", "bold")
    doc.text("PlannerCraft", pageWidth / 2, 25, { align: "center" })
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text("Order Receipt", pageWidth / 2, 33, { align: "center" })

    // Line
    doc.setDrawColor(200, 200, 200)
    doc.line(20, 38, pageWidth - 20, 38)

    // Order Info
    let y = 48
    doc.setFontSize(10)
    doc.setFont("helvetica", "bold")
    doc.text("Order ID:", 20, y)
    doc.setFont("helvetica", "normal")
    doc.text(order.id, 70, y)
    y += 7
    doc.setFont("helvetica", "bold")
    doc.text("Transaction ID:", 20, y)
    doc.setFont("helvetica", "normal")
    doc.text(order.transactionId, 70, y)
    y += 7
    doc.setFont("helvetica", "bold")
    doc.text("Date:", 20, y)
    doc.setFont("helvetica", "normal")
    doc.text(new Date(order.date).toLocaleString(), 70, y)
    y += 7
    doc.setFont("helvetica", "bold")
    doc.text("Payment:", 20, y)
    doc.setFont("helvetica", "normal")
    doc.text(order.paymentMethod, 70, y)
    y += 12

    // Customer Info
    doc.setFont("helvetica", "bold")
    doc.text("Customer:", 20, y)
    doc.setFont("helvetica", "normal")
    doc.text(order.customerName, 70, y)
    y += 7
    doc.setFont("helvetica", "bold")
    doc.text("Email:", 20, y)
    doc.setFont("helvetica", "normal")
    doc.text(order.customerEmail, 70, y)
    y += 7
    doc.setFont("helvetica", "bold")
    doc.text("Address:", 20, y)
    doc.setFont("helvetica", "normal")
    doc.text(order.shippingAddress, 70, y)
    y += 12

    doc.line(20, y, pageWidth - 20, y)
    y += 8

    // Items Header
    doc.setFont("helvetica", "bold")
    doc.text("Item", 20, y)
    doc.text("Qty", 120, y)
    doc.text("Price", 145, y)
    doc.text("Total", 170, y)
    y += 7
    doc.line(20, y - 2, pageWidth - 20, y - 2)

    // Items
    doc.setFont("helvetica", "normal")
    order.items.forEach((item) => {
      doc.text(item.product.name, 20, y + 4)
      doc.text(String(item.quantity), 120, y + 4)
      doc.text(`Rs.${item.product.price}`, 145, y + 4)
      doc.text(`Rs.${item.product.price * item.quantity}`, 170, y + 4)
      y += 8
    })

    y += 4
    doc.line(20, y, pageWidth - 20, y)
    y += 8
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text(`Total: Rs.${order.totalAmount}`, pageWidth - 20, y, {
      align: "right",
    })

    // QR
    if (qrDataUrl) {
      doc.addImage(qrDataUrl, "PNG", pageWidth / 2 - 25, y + 10, 50, 50)
      y += 65
      doc.setFontSize(8)
      doc.setFont("helvetica", "normal")
      doc.text("Scan QR code to verify transaction", pageWidth / 2, y, {
        align: "center",
      })
    }

    doc.save(`PlannerCraft-Receipt-${order.id}.pdf`)
    toast.success("Receipt downloaded!")
  }, [order, qrDataUrl])

  if (!order) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-24 text-center lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
            <Package className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Order not found
          </h1>
          <p className="text-muted-foreground">
            This order may have expired or does not exist.
          </p>
          <Link href="/">
            <Button className="mt-2">Go Home</Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 lg:px-8">
      <canvas ref={canvasRef} className="hidden" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-6"
      >
        {/* Success / Pending Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            {order.status === "Pending" ? (
              <Clock className="h-10 w-10 text-amber-500" />
            ) : (
              <CheckCircle2 className="h-10 w-10 text-primary" />
            )}
          </div>
        </motion.div>

        <div className="text-center">
          <h1 className="font-serif text-3xl font-bold text-foreground">
            {order.status === "Pending" ? "Payment Pending" : "Order Confirmed!"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {order.status === "Pending"
              ? "We have received your transaction ID and are waiting for admin approval."
              : "Thank you for your purchase. Your order has been placed successfully."}
          </p>
        </div>

        {/* Transaction details */}
        <Card className="w-full border-border">
          <CardContent className="flex flex-col gap-4 p-6">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Order ID
                </p>
                <p className="mt-1 font-mono text-sm font-semibold text-foreground">
                  {order.id}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Transaction ID
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <p className="font-mono text-sm font-semibold text-foreground">
                    {order.transactionId}
                  </p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(order.transactionId)
                      toast.success("Copied to clipboard")
                    }}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label="Copy transaction ID"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Date
                </p>
                <p className="mt-1 text-sm text-foreground">
                  {new Date(order.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <Separator />

            {/* Items */}
            <div className="flex flex-col gap-2">
              {order.items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-foreground">
                    {item.product.name}{" "}
                    <span className="text-muted-foreground">
                      x{item.quantity}
                    </span>
                  </span>
                  <span className="font-medium text-foreground">
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
                {"₹"}{order.totalAmount}
              </span>
            </div>

            <div className="flex flex-col items-center gap-2 rounded-lg bg-secondary/50 p-4 sm:flex-row sm:justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Payment Method</p>
                <p className="text-sm font-medium text-foreground">
                  {order.paymentMethod}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="text-sm font-medium text-primary">
                  {order.status}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* QR Code */}
        {qrDataUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-border">
              <CardContent className="flex flex-col items-center gap-3 p-6">
                <p className="text-sm font-medium text-foreground">
                  Transaction QR Code
                </p>
                <img
                  src={qrDataUrl}
                  alt="Transaction QR Code"
                  className="h-40 w-40"
                />
                <p className="text-xs text-muted-foreground">
                  Save this QR code for your records
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={downloadReceipt} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download Receipt (PDF)
          </Button>
          <Link href="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
