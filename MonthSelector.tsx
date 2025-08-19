import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Calendar } from "lucide-react"

interface MonthSelectorProps {
  selectedMonth: string
  onMonthChange: (month: string) => void
  availableMonths?: { value: string; label: string }[]
}

const defaultMonths = [
  { value: '2025-01', label: 'January 2025' },
  { value: '2024-12', label: 'December 2024' },
  { value: '2024-11', label: 'November 2024' },
  { value: '2024-10', label: 'October 2024' },
  { value: '2024-09', label: 'September 2024' },
  { value: '2024-08', label: 'August 2024' },
]

export function MonthSelector({ selectedMonth, onMonthChange, availableMonths = defaultMonths }: MonthSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <Calendar className="h-4 w-4 text-muted-foreground" />
      <Select value={selectedMonth} onValueChange={onMonthChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Select month" />
        </SelectTrigger>
        <SelectContent>
          {availableMonths.map((month) => (
            <SelectItem key={month.value} value={month.value}>
              {month.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}