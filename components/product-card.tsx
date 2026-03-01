"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ShoppingCart, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >(() => {
    const defaults: Record<string, string> = {}
    product.customizations.forEach((c) => {
      defaults[c.label] = c.choices[0]
    })
    return defaults
  })

  function handleAddToCart() {
    addToCart(product, selectedOptions)
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
        <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
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
            <h3 className="font-serif text-lg font-semibold leading-snug text-foreground">
              {product.name}
            </h3>
            <span className="shrink-0 text-lg font-bold text-primary">
              {"₹"}{product.price}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
            {product.description}
          </p>
          <div className="flex flex-col gap-2">
            {product.customizations.map((customization) => (
              <div key={customization.label} className="flex items-center gap-2">
                <span className="w-20 shrink-0 text-xs font-medium text-muted-foreground">
                  {customization.label}
                </span>
                <Select
                  value={selectedOptions[customization.label]}
                  onValueChange={(value) =>
                    setSelectedOptions((prev) => ({
                      ...prev,
                      [customization.label]: value,
                    }))
                  }
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {customization.choices.map((choice) => (
                      <SelectItem key={choice} value={choice} className="text-xs">
                        {choice}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
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
    </motion.div>
  )
}
