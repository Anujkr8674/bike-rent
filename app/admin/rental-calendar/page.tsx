import { Metadata } from "next";
import { RentalCalendar } from "@/components/admin/calendar/rental-calendar";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Rental Calendar | Admin",
};

export default async function RentalCalendarPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/admin/login");
  }

  return (
    <div className="space-y-5 px-4 py-5 sm:px-6 lg:px-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#FF653F]">Admin</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">Rental Calendar</h1>
          <p className="mt-1 max-w-xl text-sm text-zinc-400">
            Visual timeline showing which bikes are booked, when they are scheduled for pickup/return.
          </p>
        </div>
      </section>

      <RentalCalendar />
    </div>
  );
}
