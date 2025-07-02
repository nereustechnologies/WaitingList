"use client"

import { useEffect, useState } from "react"
import Component from "../waiting-list-form"
import MobileComponent from "../mobile-waitingList"

export default function Page() {
  const [hasMounted, setHasMounted] = useState(false)
  const [isNotMobile, setIsNotMobile] = useState(false)

  useEffect(() => {
    const updateSize = () => {
      setIsNotMobile(window.innerWidth > 768)
    }

    updateSize()
    setHasMounted(true)

    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  if (!hasMounted) return null // 👈 Prevent initial flash

  return isNotMobile ? <Component /> : <MobileComponent />
}
