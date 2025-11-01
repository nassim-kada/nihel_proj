// components/ui/calendar.tsx
"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export type CalendarProps = {
  mode?: "single"
  selected?: Date
  onSelect?: (date: Date | undefined) => void
  disabled?: (date: Date) => boolean
  className?: string
}

function Calendar({
  selected,
  onSelect,
  disabled,
  className = "",
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(selected || new Date())

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: (Date | null)[] = []

    // Add empty slots for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const days = getDaysInMonth(currentMonth)

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const isSameDay = (date1: Date | null, date2: Date | null | undefined) => {
    if (!date1 || !date2) return false
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    )
  }

  const isToday = (date: Date | null) => {
    if (!date) return false
    const today = new Date()
    return isSameDay(date, today)
  }

  const handleDateClick = (date: Date | null) => {
    if (!date) return
    if (disabled && disabled(date)) return
    onSelect?.(date)
  }

  return (
    <div className={`w-full max-w-sm mx-auto bg-white rounded-xl border-2 border-blue-100 p-3 md:p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={goToPreviousMonth}
          className="h-8 w-8 md:h-10 md:w-10 border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-blue-600"
        >
          <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
        </Button>
        
        <h2 className="text-base md:text-xl font-bold text-gray-900">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>
        
        <Button
          variant="outline"
          size="icon"
          onClick={goToNextMonth}
          className="h-8 w-8 md:h-10 md:w-10 border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-blue-600"
        >
          <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
        </Button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-[10px] md:text-sm font-bold text-gray-600 py-1 md:py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 md:gap-2">
        {days.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="aspect-square" />
          }

          const isDisabled = disabled && disabled(date)
          const isSelectedDay = isSameDay(date, selected)
          const isTodayDay = isToday(date)

          return (
            <button
              key={index}
              onClick={() => handleDateClick(date)}
              disabled={isDisabled}
              className={`
                aspect-square rounded-lg text-xs md:text-base font-semibold transition-all
                ${isDisabled
                  ? "text-gray-300 cursor-not-allowed opacity-40"
                  : isSelectedDay
                  ? "bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-lg scale-105 hover:from-blue-600 hover:to-sky-600"
                  : isTodayDay
                  ? "bg-blue-100 text-blue-700 font-bold ring-2 ring-blue-400 hover:bg-blue-200"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:scale-105"
                }
              `}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

Calendar.displayName = "Calendar"

export { Calendar }