"use client"

import { useState } from "react"
import { Phone, X, MessageCircle, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const crisisResources = [
  {
    name: "Jamaica One Love Helpline",
    phone: "+1-888-ONE-LOVE",
    description: "24/7 crisis support for Jamaica",
  },
  {
    name: "Jamaica Mental Health Helpline",
    phone: "+1-876-619-1234",
    description: "Compassionate support and referrals",
  },
  {
    name: "Jamaica HELP Hotline",
    phone: "+1-888-554-HELP",
    description: "Emergency mental health assistance",
  },
]

export function CrisisButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-crisis text-crisis-foreground hover:bg-crisis/90 shadow-lg rounded-full h-14 px-6 gap-2 font-semibold"
        aria-label="Get crisis help"
      >
        <Phone className="h-5 w-5" aria-hidden="true" />
        <span>Crisis Help</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Heart className="h-5 w-5 text-crisis" aria-hidden="true" />
              Crisis Support Resources
            </DialogTitle>
            <DialogDescription>
              Yuh not alone in dis. Help is available 24/7. If you are in danger, 
              please reach out to one of these Jamaican crisis resources.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {crisisResources.map((resource) => (
              <div
                key={resource.name}
                className="p-4 rounded-lg bg-secondary border border-border"
              >
                <h3 className="font-semibold text-foreground">
                  {resource.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {resource.description}
                </p>
                <a
                  href={`tel:${resource.phone.replace(/\D/g, "")}`}
                  className="inline-flex items-center gap-2 mt-2 text-primary font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {resource.phone}
                </a>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground flex items-start gap-2">
              <MessageCircle
                className="h-4 w-4 mt-0.5 shrink-0"
                aria-hidden="true"
              />
              <span>
                If you are in immediate danger, please call emergency services
                (911) or go to your nearest emergency room.
              </span>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
