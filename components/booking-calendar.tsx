"use client"

interface Slot {
  date: string
  times: string[]
}

export default function BookingCalendar({
  slots,
  selectedDate,
  onSelectDate,
}: {
  slots: Slot[]
  selectedDate: string | null
  onSelectDate: (date: string) => void
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3">
        {slots.map((slot) => {
          const date = new Date(slot.date)
          const dayName = date.toLocaleDateString("en-US", { weekday: "short" })
          const dayNum = date.getDate()
          const monthName = date.toLocaleDateString("en-US", { month: "short" })

          return (
            <button
              key={slot.date}
              onClick={() => onSelectDate(slot.date)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedDate === slot.date ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-foreground">{dayName}</p>
                  <p className="text-sm text-muted-foreground">
                    {dayNum} {monthName}
                  </p>
                </div>
                <div className="text-xs font-medium text-primary">{slot.times.length} slots</div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
