"use client"

import { motion } from "framer-motion"
import { ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  function scrollToProducts() {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative flex flex-col items-center justify-center overflow-hidden bg-secondary/30 px-4 py-24 text-center lg:py-36">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-2xl"
      >
        <p className="mb-3 text-sm font-medium tracking-widest uppercase text-primary">
          Handcrafted for your goals
        </p>
        <h1 className="font-serif text-4xl leading-tight font-bold text-balance text-foreground md:text-5xl lg:text-6xl">
          Plan your days, design your life
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
          Premium planners built for productivity, habits, and goals. Find the
          perfect one to organize your world.
        </p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-8"
        >
          <Button size="lg" onClick={scrollToProducts} className="px-8">
            Browse Planners
            <ArrowDown className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </motion.div>


    </section>
  )
}
