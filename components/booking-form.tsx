"use client";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatCurrency } from "@/lib/utils";
import { calcRentalDays } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { ranchiBikes } from "@/lib/bikes";
import { Calendar, CreditCard } from "lucide-react";

const bookingSchema = z.object({
  bikeId: z.string().min(1),
  city: z.string().min(1),
  rentalType: z.enum(["HOURLY", "DAILY"]),
  hours: z.string().min(1),
  pickupDate: z.string().min(1),
  dropDate: z.string().min(1),
});

type BookingInput = z.infer<typeof bookingSchema>;

export function BookingForm() {
  const { register, control, handleSubmit } = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { bikeId: "pulsar-150", city: "ranchi", rentalType: "DAILY", hours: "4" },
  });

  const bikeId = useWatch({ control, name: "bikeId" });
  const rentalType = useWatch({ control, name: "rentalType" });
  const hours = Number(useWatch({ control, name: "hours" }) || "1");
  const pickup = useWatch({ control, name: "pickupDate" });
  const drop = useWatch({ control, name: "dropDate" });
  const selectedBike = ranchiBikes.find((b) => b.id === bikeId) ?? ranchiBikes[0];

  const days = calcRentalDays(pickup || "", drop || "");
  const amount = rentalType === "HOURLY" ? hours * selectedBike.pricePerHour : days * selectedBike.pricePerDay;
  const summary = { days, amount, advance: Math.round(amount * 0.3), deposit: 2000 };

  return (
    <form className="glass-strong gradient-border space-y-6 rounded-3xl p-6 md:p-8" onSubmit={handleSubmit(() => undefined)}>
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">Booking</p>
        <h2 className="font-display mt-1 text-2xl font-bold text-zinc-900">Complete your Ranchi ride</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <select {...register("bikeId")} className="input-field">
          {ranchiBikes.map((bike) => (
            <option key={bike.id} value={bike.id}>
              {bike.name}
            </option>
          ))}
        </select>
        <input {...register("city")} readOnly className="input-field capitalize" />
        <select {...register("rentalType")} className="input-field">
          <option value="DAILY">Daily Rental</option>
          <option value="HOURLY">Hourly Rental</option>
        </select>
        <input type="number" {...register("hours")} className="input-field" placeholder="Hours (hourly only)" />
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-500" />
          <input type="date" {...register("pickupDate")} className="input-field pl-10" />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-500" />
          <input type="date" {...register("dropDate")} className="input-field pl-10" />
        </div>
      </div>
      <div className="rounded-2xl border border-zinc-100 bg-gradient-to-br from-blue-50/80 to-violet-50/50 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Price summary</p>
        <p className="mt-2 font-display text-3xl font-bold text-zinc-900">{formatCurrency(summary.amount)}</p>
        <p className="text-sm text-blue-600">
          {rentalType === "DAILY"
            ? `${formatCurrency(selectedBike.pricePerDay)}/day × ${summary.days} days`
            : `${formatCurrency(selectedBike.pricePerHour)}/hr × ${hours} hours`}
        </p>
        <div className="mt-4 space-y-1 border-t border-zinc-200/60 pt-4 text-sm text-zinc-600">
          <p>Bike: <span className="font-medium text-zinc-900">{selectedBike.name}</span></p>
          <p>Advance (30%): {formatCurrency(summary.advance)}</p>
          <p>Security deposit: {formatCurrency(summary.deposit)}</p>
        </div>
      </div>
      <Button type="submit" className="w-full" size="lg">
        <CreditCard className="h-4 w-4" />
        Proceed to Payment
      </Button>
    </form>
  );
}
