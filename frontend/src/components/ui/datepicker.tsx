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
  date = new Date(),
  setDate,
  fromDate,
  toDate,
}: DatePickerProps) {
  let boundedDate = date;

  if (fromDate && date < fromDate) {
    boundedDate = fromDate;
  }

  if (toDate && date && date > toDate) {
    boundedDate = toDate;
  }

  console.log({ boundedDate });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !boundedDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
          {boundedDate ? format(boundedDate, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={boundedDate}
          onSelect={(date) => setDate(date)}
          fromDate={fromDate}
          toDate={toDate}
          initialFocus
          defaultMonth={boundedDate || fromDate || new Date()}
        />
      </PopoverContent>
    </Popover>
  );
}
