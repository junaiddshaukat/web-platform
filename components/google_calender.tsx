"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const GoogleCalendar: React.FC = () => {
  const calendarSrc =
    "https://calendar.google.com/calendar/embed?src=b05fc20c6b19f3e00c58020936a70187016673be0bf971a8f379802a53f0ce43%40group.calendar.google.com&ctz=Asia%2FKarachi"
  const addToCalendarLink =
    "https://calendar.google.com/calendar/u/0?cid=YjA1ZmMyMGM2YjE5ZjNlMDBjNTgwMjA5MzZhNzAxODcwMTY2NzNiZTBiZjk3MWE4ZjM3OTgwMmE1M2YwY2U0M0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t"

  return (
    <Card className="w-full mt-5 max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Stay Updated with Our Events</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div className="w-full aspect-video rounded-lg overflow-hidden shadow-lg">
          <iframe
            src={calendarSrc}
            style={{ border: 0 }}
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
          ></iframe>
        </div>
        <Button className="mt-4" onClick={() => window.open(addToCalendarLink, "_blank")}>
          Add to Your Calendar
        </Button>
      </CardContent>
    </Card>
  )
}

export default GoogleCalendar

