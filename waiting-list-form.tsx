"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select"

export default function Component() {
  const formRef = useRef<HTMLFormElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [selectedCity, setSelectedCity] = useState("")
  const [heardFrom, setHeardFrom] = useState("");
const [gymName, setGymName] = useState("");
const [otherSource, setOtherSource] = useState("");
  
  const [otherCity, setOtherCity] = useState("")

  const validateInputs = (data: {
    fullName: string
    phoneNumber: string
    email: string
    city: string
  }) => {
    const { fullName, phoneNumber, email, city } = data
    if (!fullName.trim() || fullName.length < 2) return "Full Name must be at least 2 characters."
    if (!/^[6-9]\d{9}$/.test(phoneNumber)) return "Phone Number must be a valid 10-digit Indian number."
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email format."
    if (!city.trim() || city.length < 2) return "City name must be at least 2 characters."
    return null
  }

  const handleSubmit = async () => {
    if (!formRef.current) return

    if ((heardFrom === "Gym / Club" && !gymName.trim()) ||
    (heardFrom === "Other" && !otherSource.trim())) {
  alert("Please fill out the required details.");
  return;
}


    setIsSubmitting(true)
    setSubmitStatus("idle")
    setErrorMsg(null)

    const formData = new FormData(formRef.current)
    const data = {
      fullName: formData.get("fullName") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      email: formData.get("email") as string,
      city: selectedCity === "Other" ? otherCity : selectedCity,
        gymName: heardFrom === "Gym / Club" ? gymName : "",
  otherSource: heardFrom === "Other" ? otherSource : "",
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
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
      setErrorMsg("Network error. Please try again.")
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (

    <div className="min-h-screen bg-black text-white font-sans p-4 sm:p-6 items-center  flex flex-col justify-center" 
    
    >
       <img
              src="https://www.nereustechnologies.com/assets/desktop-bg-3-bYHITNSP.jpg"
              alt="silhouette"
              className="absolute inset-0 w-full h-full object-cover opacity-90"
            />
      <div className=" grid grid-cols-1 md:grid-cols-7 gap-8 h-[700px] w-[70%] md:min-w-[800px]">
        {/* LEFT SIDE */}
        <div className="flex flex-col gap-6 md:col-span-4 ">
          {/* Header inside left only */}
          <div className="flex justify-between items-start p-4 rounded-2xl text-center h-[30%] text-white bg-black/60 backdrop-blur-sm">
            <div className="flex justify-center items-center">
           
              <div>
                <h1 className="font-semibold text-white text-4xl" style={{
                  fontFamily:"Gerante"
                }}>Built for the ones who move different</h1>
               
              </div>
            </div>
           
          </div>

          {/* Orange card block */}
         {/* Orange card block with image and logo overlay */}
<div className="relative rounded-2xl overflow-hidden min-h-[440px]  p-0 flex flex-col justify-end h-full  border-s-gray-100 border-[0.5px]">
  
  {/* The Image */}
  <img
    src="/sesnor.PNG"
    alt="silhouette"
    className="absolute inset-0 w-full h-full object-fit opacity-70"
  />

  {/* Logo on top of image */}
  <div className="absolute top-4 left-4 px-4 py-2 rounded-2xl z-10">
    <img     src="/log.png" alt="Company Logo" className="w-12 h-auto" />
  </div>

  {/* Optional caption or space filler */}
  <div className="relative z-10 p-6 text-white">
    {/* You can place motivational text here if needed */}
  </div>
</div>
        </div>

        {/* RIGHT SIDE */}
        <div className="relative bg-gradient-to-t bg-gray-900 rounded-2xl p-6 sm:p-8 md:col-span-3  border-s-gray-100 border-[0.5px] flex flex-col justify-center">
          {/* Vertical Text */}
         
          <h3 className="text-2xl font-bold mb-6 text-white text-center" style={{
                  fontFamily:"Gerante"
                }}>
            Join the Wait List
          </h3>

          <form ref={formRef} className="space-y-4 items-center">
            <div className="mb-2">
              <Label className="text-white">Full Name</Label>
              <Input
                name="fullName"
                placeholder="Your full name"
                className="bg-black/40 text-white border border-gray-700 mt-1"
                required
              />
            </div>
           <div className="mb-2">
              <Label className="text-white">Phone Number</Label>
              <Input
                name="phoneNumber"
                inputMode="numeric"
                maxLength={10}
                pattern="[6-9]{1}[0-9]{9}"
                onInput={(e) => {
                  const input = e.currentTarget
                  input.value = input.value.replace(/\D/g, "")
                }}
                placeholder="10-digit mobile number"
                className="bg-black/40 text-white border border-gray-700 mt-1"
                required
              />
            </div>
            <div className="mb-2">
              <Label className="text-white">Email Address</Label>
              <Input
                name="email"
                type="email"
                placeholder="name@example.com"
                className="bg-black/40 text-white border border-gray-700 mt-1"
                required
              />
            </div>

            <div className="mb-2">
              <Label className="text-white">City</Label>
              <Select onValueChange={setSelectedCity}>
                <SelectTrigger className="bg-black/40 text-white border border-gray-700 mt-1">
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
                  className="bg-black/40 text-white border border-gray-700 mt-2 mb-2"
                  required
                />
              )}
            </div>
            <div className="mb-2">
  <Label className="text-white">How did you hear about Nereus?</Label>
  <Select onValueChange={setHeardFrom} required>
    <SelectTrigger className="bg-black/40 text-white border border-gray-700 mt-1">
      <SelectValue placeholder="Select an option" />
    </SelectTrigger>
    <SelectContent className="bg-gray-800 text-white">
      <SelectItem value="Run Club">56 Run Club</SelectItem>
      <SelectItem value="Instagram">Instagram</SelectItem>
      <SelectItem value="LinkedIn">LinkedIn</SelectItem>
      <SelectItem value="Word of Mouth">Word of Mouth</SelectItem>
      <SelectItem value="Live Demo">Live Demo</SelectItem>
      <SelectItem value="Gym / Club">Gym / Club</SelectItem>
      <SelectItem value="Other">Other</SelectItem>
    </SelectContent>
  </Select>

  {heardFrom === "Gym / Club" && (
    <Input
      type="text"
      placeholder="Enter your gym/club name"
      value={gymName}
      onChange={(e) => setGymName(e.target.value)}
      className="bg-black/40 text-white border border-gray-700 mt-2 mb-2"
      required
    />
  )}

  {heardFrom === "Other" && (
    <Input
      type="text"
      placeholder="Please specify"
      value={otherSource}
      onChange={(e) => setOtherSource(e.target.value)}
      className="bg-black/40 text-white border border-gray-700 mt-2 mb-2"
      required
    />
  )}
</div>


            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full mt-6 h-12 rounded-full font-semibold text-black"
              style={{ backgroundColor: isSubmitting ? "" : "white" }}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>

            {submitStatus === "success" && (
              <p className="text-green-400 text-sm text-center mt-2">
                Thank you! You've been added to our waiting list.
              </p>
            )}
            {submitStatus === "error" && errorMsg && (
              <p className="text-red-400 text-sm text-center mt-2">{errorMsg}</p>
            )}
          </form>
        </div>
      </div>
    </div>
   
  )
}

