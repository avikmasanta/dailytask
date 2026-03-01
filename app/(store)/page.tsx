"use client"

import { products } from "@/lib/data"
import { HeroSection } from "@/components/hero-section"
import { ProductCard } from "@/components/product-card"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <section id="products" className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="font-serif text-3xl font-bold text-foreground">
            Our Planners
          </h2>
          <p className="mt-2 text-muted-foreground">
            Thoughtfully designed to help you organize every day
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </section>
    </>
  )
}
