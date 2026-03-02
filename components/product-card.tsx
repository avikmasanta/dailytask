"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ShoppingCart, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { useStore } from "@/lib/store"
import type { Product } from "@/lib/data"
import { toast } from "sonner"

interface ProductCardProps {
  product: Product
  index: number
}

export function ProductCard({ product, index }: ProductCardProps) {
  const { addToCart } = useStore()
  const [added, setAdded] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  function handleAddToCart() {
    addToCart(product, {})
    setAdded(true)
    toast.success(`${product.name} added to cart`)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Card className="group overflow-hidden border-border transition-shadow duration-300 hover:shadow-lg">
        <div
          className="relative aspect-[4/3] overflow-hidden bg-secondary cursor-pointer"
          onClick={() => setIsDetailsOpen(true)}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
            {product.category}
          </Badge>
        </div>
        <CardContent className="flex flex-col gap-3 p-5">
          <div className="flex items-start justify-between gap-2">
            <h3
              className="font-serif text-lg font-semibold leading-snug text-foreground cursor-pointer hover:underline"
              onClick={() => setIsDetailsOpen(true)}
            >
              {product.name}
            </h3>
            <span className="shrink-0 text-lg font-bold text-primary">
              {"₹"}{product.price}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
            {product.description}
          </p>

          <Button
            onClick={handleAddToCart}
            className="mt-1 w-full"
            disabled={added}
          >
            {added ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Added
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[500px] gap-6">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">{product.name}</DialogTitle>
          </DialogHeader>
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-secondary">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 500px) 100vw, 500px"
            />
            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
              {product.category}
            </Badge>
          </div>
          <DialogDescription className="text-base leading-relaxed text-foreground whitespace-pre-wrap max-h-[35vh] overflow-y-auto pr-4">
            {product.description}
          </DialogDescription>
          <div className="flex items-center justify-between mt-2 pt-4 border-t">
            <span className="text-xl font-bold text-primary">{"₹"}{product.price}</span>
            <Button onClick={() => { setIsDetailsOpen(false); handleAddToCart(); }}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
