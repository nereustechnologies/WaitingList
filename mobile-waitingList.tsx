"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"

export default function MobileComponent() {
  const formRef = useRef<HTMLFormElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [selectedCity, setSelectedCity] = useState("")
  const [otherCity, setOtherCity] = useState("")
  const [heardFrom, setHeardFrom] = useState("")
  const [gymName, setGymName] = useState("")
  const [otherSource, setOtherSource] = useState("")

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
    if ((heardFrom === "Gym / Club" && !gymName.trim()) ||
        (heardFrom === "Other" && !otherSource.trim())) {
      return "Please provide the required details for how you heard about us."
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
      heardFrom,
      gymName: heardFrom === "Gym / Club" ? gymName : "",
      otherSource: heardFrom === "Other" ? otherSource : ""
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
    <div className="relative min-h-screen bg-black text-white flex items-center justify-center">
      <img src="/sesnor.PNG" alt="Background" className="absolute inset-0 w-full h-full object-cover z-0" />
      <img src="/log.png" alt="Logo" className="absolute z-50 top-4 left-4 h-12" />
      <div className="absolute inset-0 bg-black bg-opacity-60 z-10" />
      <div className="relative z-20 text-center px-4">
        <h1 className="text-md mb-2 font-light" style={{ fontFamily: "Gerante" }}>
          BUILT FOR THOSE WHO MOVE DIFFERENT
        </h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="text-white font-bold text-base bg-white/10 border border-white rounded-full px-6 py-3 mt-2 hover:bg-white hover:text-black transition">
              JOIN THE WAITLIST NOW
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-md w-[95%] bg-white text-black rounded-xl p-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold mb-2 text-center">Join The Wait List</DialogTitle>
            </DialogHeader>

            <form ref={formRef} className="space-y-4">
              <div>
                <Label className="text-sm">Full Name</Label>
                <Input name="fullName" placeholder="Your full name" required />
              </div>

              <div>
                <Label className="text-sm">Phone Number</Label>
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
                  required
                />
              </div>

              <div>
                <Label className="text-sm">Email Address</Label>
                <Input name="email" type="email" placeholder="name@example.com" required />
              </div>

              <div>
                <Label className="text-sm">City</Label>
                <Select onValueChange={setSelectedCity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your city" />
                  </SelectTrigger>
                  <SelectContent>
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
                    className="mt-2"
                  />
                )}
              </div>

              <div>
                <Label className="text-sm">How did you hear about Nereus?</Label>
                <Select onValueChange={setHeardFrom}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Run Club">Run Club</SelectItem>
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
                    className="mt-2"
                    required
                  />
                )}

                {heardFrom === "Other" && (
                  <Input
                    type="text"
                    placeholder="Please specify"
                    value={otherSource}
                    onChange={(e) => setOtherSource(e.target.value)}
                    className="mt-2"
                    required
                  />
                )}
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full h-12 rounded-full font-semibold text-white bg-[#5cd2ec] hover:bg-[#48c4db]"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>

              {submitStatus === "success" && (
                <p className="text-green-600 text-sm text-center mt-2">
                  Thank you! You've been added to the waitlist.
                </p>
              )}
              {submitStatus === "error" && errorMsg && (
                <p className="text-red-500 text-sm text-center mt-2">{errorMsg}</p>
              )}
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
