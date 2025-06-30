"use client"

import type React from "react"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"


export default function Component() {
  const formRef = useRef<HTMLFormElement>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [selectedCity, setSelectedCity] = useState("")
const [otherCity, setOtherCity] = useState("")

  const validateInputs = (data: {
    fullName: string
    phoneNumber: string
    email: string
    city: string
  }) => {
    const { fullName, phoneNumber, email, city } = data

    if (!fullName.trim() || fullName.length < 2) {
      return "Full Name must be at least 2 characters."
    }

    if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
      return "Phone Number must be a valid 10-digit Indian number."
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Invalid email format."
    }

    if (!city.trim() || city.length < 2) {
      return "City name must be at least 2 characters."
    }

    return null
  }

 const handleSubmit = async () => {
  if (!formRef.current) return

  setIsSubmitting(true)
  setSubmitStatus("idle")
  setErrorMsg(null)

  const formData = new FormData(formRef.current)
  const data = {
    fullName: formData.get("fullName") as string,
    phoneNumber: formData.get("phoneNumber") as string,
    email: formData.get("email") as string,
    city: selectedCity === "Other" ? otherCity : selectedCity,

  }

  const validationError = validateInputs(data)
  if (validationError) {
    setErrorMsg(validationError)
    setIsSubmitting(false)
    return
  }

  try {
    const response = await fetch("/api/waitlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (response.ok) {
      setSubmitStatus("success")
      formRef.current.reset()
    } else {
      const body = await response.json()
      setErrorMsg(body?.error || "Server rejected the request")
      setSubmitStatus("error")
    }
  } catch (error) {
    console.error("Error submitting form:", error)
    setErrorMsg("Network error. Please try again.")
    setSubmitStatus("error")
  } finally {
    setIsSubmitting(false)
  }
}


  return (
  <div className="min-h-screen bg-cover bg-center flex items-center justify-center p-4 sm:p-6 lg:p-8"
  style={{
    backgroundImage: "url('https://www.nereustechnologies.com/assets/desktop-bg-3-bYHITNSP.jpg')",
  }}
  >
  <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
    
    {/* Left section: Company logo and name */}
    <div className="flex flex-col items-center  text-center md:text-left space-y-4">
      <img src="data:image/svg+xml,%3c?xml%20version=%271.0%27%20encoding=%27UTF-8%27?%3e%3csvg%20id=%27Layer_2%27%20data-name=%27Layer%202%27%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%2057.68%2063.14%27%3e%3cdefs%3e%3cstyle%3e%20.cls-1%20{%20fill:%20%235bd2ec;%20stroke-width:%200px;%20}%20%3c/style%3e%3c/defs%3e%3cg%20id=%27pg1%27%3e%3cg%3e%3cpath%20class=%27cls-1%27%20d=%27m29.21,47.25c.18.1.18.37,0,.47l-24.42,14.94c-2.28,1.4-5.16-.51-4.76-3.16l2.77-18.22c0-.08.05-.15.12-.19l6.81-4.5c.44-.29,1.01-.31,1.47-.04l18.01,10.68Z%27/%3e%3cpath%20class=%27cls-1%27%20d=%27m54.37,25.85l-2.86,20.82c-.72,5.22-6.54,8.02-11.06,5.31l-28.57-17.1c-.92-.55-2.07-.52-2.95.07l-5.38,3.57c-.2.13-.46-.03-.42-.27l2.87-20.88c.72-5.21,6.51-8,11.03-5.32l28.8,17.09c.92.55,2.07.51,2.96-.08l5.15-3.48c.2-.13.46.03.43.27Z%27/%3e%3cpath%20class=%27cls-1%27%20d=%27m57.64,3.61l-2.74,18.94c-.01.08-.05.14-.12.19l-6.77,4.56c-.44.3-1.01.32-1.47.05l-18.11-10.52c-.18-.1-.18-.36-.01-.47L52.81.52c2.27-1.47,5.22.41,4.83,3.09Z%27/%3e%3c/g%3e%3c/g%3e%3c/svg%3e" style={{height:"100px"}} />
    <h1
            className={`text-white font-bold text-2xl sm:text-3xl md:text-4xl text-center break-words `}
            style={{
              fontFamily: "Gerante",
              lineHeight:'4rem'
            }}
          >
            Built for the ones who move different
          </h1>
    </div>

    {/* Right section: Form */}
    <Card className="w-full bg-gray-900 border-gray-800 shadow-2xl">
      <CardHeader className="text-center pt-8 pb-4 px-6 sm:px-8">
        <CardTitle className="text-2xl sm:text-3xl font-bold text-white mb-2"  style={{
              fontFamily: "Gerante",
              lineHeight:'4rem'
            }}>Join the Waiting List</CardTitle>
        <CardDescription className="text-gray-400 text-sm sm:text-base">
        
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-6 sm:px-8 pb-8">
        <form ref={formRef} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-white font-medium">Full Name</Label>
            <Input id="fullName" name="fullName" type="text" placeholder="Your full name" required className="bg-gray-800 border-gray-700 text-white" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-white font-medium">Phone Number</Label>
           <Input
  id="phoneNumber"
  name="phoneNumber"
  type="tel"
  inputMode="numeric"
  pattern="[6-9]{1}[0-9]{9}"
  maxLength={10}
  placeholder="10-digit mobile number"
  required
  className="bg-gray-800 border-gray-700 text-white"
  onInput={(e) => {
    const input = e.currentTarget
    input.value = input.value.replace(/\D/g, "") // remove non-digits
  }}
/>

          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white font-medium">Email Address</Label>
            <Input id="email" name="email" type="email" placeholder="name@example.com" required className="bg-gray-800 border-gray-700 text-white" />
          </div>

        <div className="space-y-2">
  <Label htmlFor="city" className="text-white font-medium">City</Label>
  <Select onValueChange={setSelectedCity}>
    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
      <SelectValue placeholder="Select your city" />
    </SelectTrigger>
    <SelectContent className="bg-gray-800 text-white">
      <SelectItem value="Bengaluru">Bengaluru</SelectItem>
      <SelectItem value="Chennai">Chennai</SelectItem>
      <SelectItem value="Hyderabad">Hyderabad</SelectItem>
      <SelectItem value="Mumbai">Mumbai</SelectItem>
      <SelectItem value="Delhi">Delhi</SelectItem>
      <SelectItem value="Calcutta">Calcutta</SelectItem>
      <SelectItem value="Other">Other</SelectItem>
    </SelectContent>
  </Select>

  {selectedCity === "Other" && (
    <Input
      type="text"
      placeholder="Enter your city"
      value={otherCity}
      onChange={(e) => setOtherCity(e.target.value)}
      className="bg-gray-800 border-gray-700 text-white mt-2"
      required
    />
  )}
</div>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full mt-8 h-12 sm:h-14 rounded-full font-semibold text-black transition-all duration-200 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50"
            style={{ backgroundColor: isSubmitting ? "#4bc5e0" : "#5cd2ec" }}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>

        {submitStatus === "success" && (
          <div className="mt-4 p-4 bg-green-900/50 border border-green-700 rounded-lg text-green-300 text-center">
            Thank you! You've been added to our waiting list.
          </div>
        )}
        {submitStatus === "error" && errorMsg && (
          <div className="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-300 text-center">
            {errorMsg}
          </div>
        )}
      </CardContent>
    </Card>
  </div>
</div>

  )
}
