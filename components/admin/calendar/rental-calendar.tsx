"use client";

import { useState, useEffect } from "react";
import { format, addDays, startOfDay, isWithinInterval, parseISO } from "date-fns";
import { ChevronLeft, ChevronRight, Loader2, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BikeRow = {
  id: string;
  name: string;
  bikeNo: string | null;
  isAvailable: boolean;
};

type BookingEvent = {
  id: string;
  bikeId: string;
  pickupDate: string;
  pickupTime: string | null;
  dropDate: string;
  returnTime: string | null;
  customerName: string;
  status: string;
  bookingRef: string;
};

export function RentalCalendar() {
  const [startDate, setStartDate] = useState(startOfDay(new Date()));
  const [bikes, setBikes] = useState<BikeRow[]>([]);
  const [bookings, setBookings] = useState<BookingEvent[]>([]);
  const [bufferMinutes, setBufferMinutes] = useState(30);
  const [loading, setLoading] = useState(true);

  // Generate 14 days for the view
  const days = Array.from({ length: 14 }).map((_, i) => addDays(startDate, i));
  const endDate = days[days.length - 1];

  const fetchCalendar = async () => {
    setLoading(true);
    try {
      const startStr = startDate.toISOString();
      const endStr = endDate.toISOString();
      
      const res = await fetch(`/api/admin/rental-calendar?start=${startStr}&end=${endStr}`, { cache: "no-store" });
      const data = await res.json();
      if (res.ok) {
        setBikes(data.bikes || []);
        setBookings(data.bookings || []);
        setBufferMinutes(data.bufferMinutes || 30);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendar();
  }, [startDate]);

  const handlePrev = () => setStartDate(prev => addDays(prev, -7));
  const handleNext = () => setStartDate(prev => addDays(prev, 7));
  const handleToday = () => setStartDate(startOfDay(new Date()));

  // Helper to get color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
      case "ACTIVE": return "bg-emerald-500/20 border-emerald-500/50 text-emerald-300";
      case "RETURNED": return "bg-blue-500/20 border-blue-500/50 text-blue-300";
      case "AWAITING_DOCUMENTS":
      case "VERIFICATION_PENDING": return "bg-amber-500/20 border-amber-500/50 text-amber-300";
      default: return "bg-zinc-500/20 border-zinc-500/50 text-zinc-300";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-[#111111] p-4 rounded-xl border border-white/10">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-[#FF653F]" />
          <h2 className="text-lg font-bold text-white">Rental Timeline</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleToday} className="bg-[#0A0A0A] border-white/10 text-white">
            Today
          </Button>
          <div className="flex bg-[#0A0A0A] rounded-md border border-white/10 overflow-hidden">
            <button onClick={handlePrev} className="px-3 py-1.5 hover:bg-white/10 text-white transition">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-3 py-1.5 text-sm font-medium text-zinc-300 border-x border-white/10 flex items-center justify-center min-w-[140px]">
              {format(startDate, "MMM d")} - {format(endDate, "MMM d, yyyy")}
            </div>
            <button onClick={handleNext} className="px-3 py-1.5 hover:bg-white/10 text-white transition">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#111111] rounded-xl border border-white/10 overflow-x-auto shadow-2xl">
        {loading ? (
          <div className="h-64 flex items-center justify-center flex-col gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF653F]" />
            <p className="text-sm text-zinc-400">Loading timeline...</p>
          </div>
        ) : (
          <div className="min-w-[1200px]">
            {/* Header row (Days) */}
            <div className="flex border-b border-white/10">
              <div className="w-64 shrink-0 bg-[#0A0A0A] p-4 font-semibold text-sm text-zinc-400 border-r border-white/10 flex items-center">
                Bikes
              </div>
              <div className="flex-1 flex">
                {days.map((day, i) => (
                  <div key={i} className="flex-1 min-w-[80px] border-r border-white/5 p-2 text-center">
                    <p className="text-xs font-semibold text-white">{format(day, "EEE")}</p>
                    <p className={cn("text-sm font-bold mt-1", format(day, "MM-dd") === format(new Date(), "MM-dd") ? "text-[#FF653F]" : "text-zinc-500")}>
                      {format(day, "dd")}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Body rows (Bikes) */}
            <div className="divide-y divide-white/5">
              {bikes.map(bike => {
                const bikeBookings = bookings.filter(b => b.bikeId === bike.id);
                
                return (
                  <div key={bike.id} className="flex group hover:bg-white/[0.02] transition">
                    <div className="w-64 shrink-0 p-3 border-r border-white/10 bg-[#0A0A0A]/50">
                      <p className="font-semibold text-sm text-white truncate">{bike.name}</p>
                      {bike.bikeNo && <p className="text-xs text-zinc-500 font-mono mt-0.5">{bike.bikeNo}</p>}
                    </div>
                    
                    <div className="flex-1 flex relative">
                      {/* Grid lines */}
                      {days.map((_, i) => (
                        <div key={i} className="flex-1 min-w-[80px] border-r border-white/5" />
                      ))}

                      {/* Booking Bars */}
                      {bikeBookings.map(booking => {
                        const pTime = (booking.pickupTime || "09:00").substring(0, 5);
                        const rTime = (booking.returnTime || "18:00").substring(0, 5);
                        const pickupStr = `${booking.pickupDate.split("T")[0]}T${pTime}:00`;
                        const returnStr = `${booking.dropDate.split("T")[0]}T${rTime}:00`;
                        
                        const pDate = new Date(pickupStr);
                        const rDate = new Date(returnStr);
                        
                        // Calculate positions (percentages) relative to the current 14-day view
                        const totalViewMs = endDate.getTime() - startDate.getTime() + (24 * 60 * 60 * 1000); // 14 full days
                        
                        // Prevent bar from going out of bounds
                        const pBounded = new Date(Math.max(pDate.getTime(), startDate.getTime()));
                        const rBounded = new Date(Math.min(rDate.getTime(), endDate.getTime() + (24 * 60 * 60 * 1000)));
                        
                        if (rBounded <= pBounded) return null; // Outside view

                        const leftPercent = ((pBounded.getTime() - startDate.getTime()) / totalViewMs) * 100;
                        const widthPercent = ((rBounded.getTime() - pBounded.getTime()) / totalViewMs) * 100;

                        return (
                          <div 
                            key={booking.id}
                            className={cn(
                              "absolute top-2 bottom-2 rounded border px-2 py-1 overflow-hidden shadow-lg",
                              getStatusColor(booking.status)
                            )}
                            style={{ 
                              left: `${Math.max(0, leftPercent)}%`, 
                              width: `${Math.min(100 - leftPercent, widthPercent)}%`,
                              minWidth: "20px"
                            }}
                            title={`Booking: ${booking.bookingRef} | ${booking.customerName} | Status: ${booking.status}`}
                          >
                            <div className="flex items-center justify-between h-full">
                              <span className="text-[10px] font-bold truncate">{booking.customerName}</span>
                              <span className="text-[9px] font-mono opacity-80 shrink-0 ml-2 hidden lg:inline-block">{booking.pickupTime} - {booking.returnTime}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {bikes.length === 0 && !loading && (
              <div className="p-10 text-center text-zinc-500 text-sm">No bikes found.</div>
            )}
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-6 pt-2 pb-4 text-xs font-medium text-zinc-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/50"></div>
          Confirmed / Active
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500/50"></div>
          Pending / Awaiting Docs
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-500/20 border border-blue-500/50"></div>
          Returned (in Buffer)
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-zinc-800 border border-white/20"></div>
          Rental Buffer Time: {bufferMinutes} mins
        </div>
      </div>
    </div>
  );
}
