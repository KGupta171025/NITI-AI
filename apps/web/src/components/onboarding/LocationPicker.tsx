"use client";

import { useState } from "react";
import { BusinessLocation } from "@niti-ai/types";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { MapPin, Navigation, Compass, Search } from "lucide-react";
import { toast } from "sonner";

interface LocationPickerProps {
  value: BusinessLocation;
  onChange: (loc: BusinessLocation) => void;
}

// Major Indian States & Sample District Coordinates
const POPULAR_LOCATIONS: Record<string, { lat: number; lng: number; district: string; pincode: string }> = {
  "Bhopal, Madhya Pradesh": { lat: 23.2599, lng: 77.4126, district: "Bhopal", pincode: "462001" },
  "Indore, Madhya Pradesh": { lat: 22.7196, lng: 75.8577, district: "Indore", pincode: "452001" },
  "Mumbai, Maharashtra": { lat: 19.0760, lng: 72.8777, district: "Mumbai City", pincode: "400001" },
  "Pune, Maharashtra": { lat: 18.5204, lng: 73.8567, district: "Pune", pincode: "411001" },
  "Jaipur, Rajasthan": { lat: 26.9124, lng: 75.7873, district: "Jaipur", pincode: "302001" },
  "Ahmedabad, Gujarat": { lat: 23.0225, lng: 72.5714, district: "Ahmedabad", pincode: "380001" },
  "Surat, Gujarat": { lat: 21.1702, lng: 72.8311, district: "Surat", pincode: "395001" },
  "Bengaluru, Karnataka": { lat: 12.9716, lng: 77.5946, district: "Bengaluru Urban", pincode: "560001" },
  "Hyderabad, Telangana": { lat: 17.3850, lng: 78.4867, district: "Hyderabad", pincode: "500001" },
  "Lucknow, Uttar Pradesh": { lat: 26.8467, lng: 80.9462, district: "Lucknow", pincode: "226001" },
  "Varanasi, Uttar Pradesh": { lat: 25.3176, lng: 82.9739, district: "Varanasi", pincode: "221001" },
  "Patna, Bihar": { lat: 25.5941, lng: 85.1376, district: "Patna", pincode: "800001" },
  "Ranchi, Jharkhand": { lat: 23.3441, lng: 85.3096, district: "Ranchi", pincode: "834001" },
  "Bhubaneswar, Odisha": { lat: 20.2961, lng: 85.8245, district: "Khordha", pincode: "751001" },
  "Guwahati, Assam": { lat: 26.1445, lng: 91.7362, district: "Kamrup Metropolitan", pincode: "781001" },
  "New Delhi, Delhi": { lat: 28.6139, lng: 77.2090, district: "New Delhi", pincode: "110001" },
  "Chandigarh, Punjab": { lat: 30.7333, lng: 76.7794, district: "Chandigarh", pincode: "160017" }
};

export function LocationPicker({ value, onChange }: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLocating, setIsLocating] = useState(false);

  const handleQuickSelect = (label: string) => {
    const loc = POPULAR_LOCATIONS[label];
    if (loc) {
      const parts = label.split(", ");
      const city = parts[0] || "";
      const state = parts[1] || "";
      onChange({
        latitude: loc.lat,
        longitude: loc.lng,
        city,
        state,
        district: loc.district,
        pincode: loc.pincode,
        formattedAddress: `${city}, ${loc.district}, ${state} - ${loc.pincode}`
      });
      toast.success(`Selected ${label}`);
    }
  };

  const handleGetCurrentLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const lat = Number(pos.coords.latitude.toFixed(4));
        const lng = Number(pos.coords.longitude.toFixed(4));
        onChange({
          ...value,
          latitude: lat,
          longitude: lng,
          formattedAddress: `Lat: ${lat}, Lng: ${lng} (Current Pinpoint)`
        });
        toast.success("Location updated from device GPS");
      },
      () => {
        setIsLocating(false);
        toast.info("Using default region. You can select your state & district manually.");
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className="space-y-6">
      {/* Search & Quick Suggestions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search city or district (e.g. Bhopal, Surat, Jaipur)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <Button
          type="button"
          variant="glass"
          onClick={handleGetCurrentLocation}
          loading={isLocating}
          leftIcon={<Navigation className="w-4 h-4 text-brand-400" />}
        >
          Use Device GPS
        </Button>
      </div>

      {/* Quick Select Chips */}
      <div>
        <p className="text-xs text-slate-400 mb-2 flex items-center gap-1.5 font-medium">
          <Compass className="w-3.5 h-3.5 text-teal-400" />
          Quick Industrial Hubs & State Capitals:
        </p>
        <div className="flex flex-wrap gap-2">
          {Object.keys(POPULAR_LOCATIONS)
            .filter((name) =>
              searchQuery ? name.toLowerCase().includes(searchQuery.toLowerCase()) : true
            )
            .slice(0, 8)
            .map((locName) => (
              <button
                key={locName}
                type="button"
                onClick={() => handleQuickSelect(locName)}
                className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-brand-500/20 text-slate-300 hover:text-white border border-white/10 transition-colors"
              >
                {locName}
              </button>
            ))}
        </div>
      </div>

      {/* Visual Interactive Map Preview Display */}
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden border border-brand-500/20 bg-gradient-to-b from-slate-900/60 to-slate-950/80">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center text-brand-400">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-100">
                Geographic Pinpoint & Eligibility Scope
              </h4>
              <p className="text-xs text-slate-400">
                Schemes matching is automatically localized to state & district borders
              </p>
            </div>
          </div>
          <span className="text-xs font-mono bg-teal-500/10 text-teal-300 border border-teal-500/20 px-2.5 py-1 rounded-md">
            {value.latitude}° N, {value.longitude}° E
          </span>
        </div>

        {/* Map Representation with interactive pin */}
        <div className="h-44 rounded-xl bg-slate-950/60 border border-white/10 relative flex items-center justify-center overflow-hidden">
          {/* Subtle Grid Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30" />
          
          <div className="relative z-10 flex flex-col items-center text-center p-4">
            <div className="w-10 h-10 rounded-full bg-brand-500/30 flex items-center justify-center animate-bounce mb-2 border border-brand-400/50 shadow-glow-sm">
              <MapPin className="w-5 h-5 text-brand-400" />
            </div>
            <span className="text-sm font-semibold text-slate-100">
              {value.city || "Selected City"}, {value.state || "India"}
            </span>
            <span className="text-xs text-slate-400 max-w-sm mt-0.5">
              {value.formattedAddress || "Standardized National Address"}
            </span>
          </div>
        </div>
      </div>

      {/* Manual Editable Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Input
          label="State"
          value={value.state}
          onChange={(e) => onChange({ ...value, state: e.target.value })}
          required
        />
        <Input
          label="District"
          value={value.district}
          onChange={(e) => onChange({ ...value, district: e.target.value })}
          required
        />
        <Input
          label="City / Town"
          value={value.city}
          onChange={(e) => onChange({ ...value, city: e.target.value })}
          required
        />
        <Input
          label="Pincode"
          value={value.pincode}
          onChange={(e) => onChange({ ...value, pincode: e.target.value })}
          required
        />
      </div>
    </div>
  );
}
