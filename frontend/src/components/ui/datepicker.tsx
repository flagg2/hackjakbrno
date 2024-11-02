"use client";

import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date?: Date;
  setDate: (date: Date | undefined) => void;
  fromDate?: Date;
  toDate?: Date;
}

export function DatePicker({
  date,
  setDate,
  fromDate,
  toDate,
}: DatePickerProps) {
  React.useEffect(() => {
    if (!date) return;

    if (fromDate && date < fromDate) {
      setDate(fromDate);
    }
    if (toDate && date > toDate) {
      setDate(toDate);
    }
  }, [date, fromDate, toDate, setDate]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => setDate(date)}
          fromDate={fromDate}
          toDate={toDate}
          initialFocus
          defaultMonth={date || fromDate || new Date()}
        />
      </PopoverContent>
    </Popover>
  );
}
