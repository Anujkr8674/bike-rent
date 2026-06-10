"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function AvailabilityChecker({ slug }: { slug: string }) {
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ isAvailable: boolean; message: string } | null>(null);

  const today = new Date();
  const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const handleCheck = async () => {
    if (!pickupDate || !pickupTime || !returnDate || !returnTime) return;

    setLoading(true);
    setResult(null);

    try {
      const pickupObj = new Date(`${pickupDate}T${pickupTime}`);
      const returnObj = new Date(`${returnDate}T${returnTime}`);

      const res = await fetch(`/api/bikes/${slug}/availability`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pickupDate: pickupObj.toISOString(),
          returnDate: returnObj.toISOString()
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        setResult({ isAvailable: false, message: data.message || "Failed to check availability" });
        return;
      }

      setResult({
        isAvailable: data.isAvailable,
        message: data.reason || (data.isAvailable ? "Available For Selected Dates" : "Already Booked During Selected Dates")
      });
    } catch (err) {
      setResult({ isAvailable: false, message: "Network error occurred." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 rounded-xl border border-white/10 bg-[#111111]/50 p-4">
      <h3 className="text-sm font-semibold text-white mb-4">Check Availability</h3>
      
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="text-xs text-zinc-400 mb-1 block">Pickup Date</label>
          <input 
            type="date" 
            className="w-full rounded-md border border-white/10 bg-[#0A0A0A] p-2 text-sm text-white"
            value={pickupDate}
            min={minDate}
            onChange={(e) => setPickupDate(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs text-zinc-400 mb-1 block">Pickup Time</label>
          <input 
            type="time" 
            className="w-full rounded-md border border-white/10 bg-[#0A0A0A] p-2 text-sm text-white"
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-xs text-zinc-400 mb-1 block">Return Date</label>
          <input 
            type="date" 
            className="w-full rounded-md border border-white/10 bg-[#0A0A0A] p-2 text-sm text-white"
            value={returnDate}
            min={pickupDate || minDate}
            onChange={(e) => setReturnDate(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs text-zinc-400 mb-1 block">Return Time</label>
          <input 
            type="time" 
            className="w-full rounded-md border border-white/10 bg-[#0A0A0A] p-2 text-sm text-white"
            value={returnTime}
            onChange={(e) => setReturnTime(e.target.value)}
          />
        </div>
      </div>

      <Button 
        variant="outline" 
        className="w-full bg-[#111111] border-white/20 text-zinc-200 hover:text-white"
        onClick={handleCheck}
        disabled={loading || !pickupDate || !pickupTime || !returnDate || !returnTime}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        Check Availability
      </Button>

      {result && (
        <div className={cn(
          "mt-4 rounded-md p-3 text-sm text-center font-medium",
          result.isAvailable ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
        )}>
          {result.message}
        </div>
      )}
    </div>
  );
}
