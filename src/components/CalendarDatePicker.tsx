import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CalendarDatePickerProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
}

export function CalendarDatePicker({ selectedDate, onDateSelect }: CalendarDatePickerProps) {
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());

  return (
    <Card className="p-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onDateSelect}
        disabled={(date) => date < today}
        initialFocus
        className={cn("mx-auto pointer-events-auto")}
        fromDate={today}
        toDate={nextMonth}
      />
    </Card>
  );
}