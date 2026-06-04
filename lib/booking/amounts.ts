import { calcRentalDuration } from "@/lib/pricing";
import { combineDateAndTime } from "@/lib/rental-datetime";

export function computeGuestBookingAmounts(
  pricePerDay: number,
  pricePerHour: number,
  securityDeposit: number,
  pickupDate: string,
  pickupTime: string,
  returnDate: string,
  returnTime: string,
) {
  const pickup = combineDateAndTime(pickupDate, pickupTime);
  const drop = combineDateAndTime(returnDate, returnTime);
  const duration = calcRentalDuration(pickup, drop);

  if (!duration) {
    throw new Error("Return must be after pickup");
  }

  const rentalAmount = duration.isHourly
    ? Math.round(duration.hours * pricePerHour)
    : Math.round((duration.days || 1) * pricePerDay);

  const totalAmount = rentalAmount + securityDeposit;

  return {
    pickup,
    drop,
    duration,
    rentalDays: duration.isHourly ? 0 : duration.days || 1,
    rentalHours: duration.isHourly ? duration.hours : 0,
    rentalAmount,
    securityDeposit,
    totalAmount,
  };
}
