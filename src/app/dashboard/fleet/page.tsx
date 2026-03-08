"use client";

import React, { useState, useEffect } from "react";
import { Bike, Map as MapIcon, Battery, Wifi, Shield } from "lucide-react";

interface BikeStatus {
  id: string;
  lat: number;
  lng: number;
  battery: number;
  status: "idle" | "delivering" | "returns";
  noiseLevel: number; // dB
}

const mockBikes: BikeStatus[] = [
  { id: "WKP-01", lat: 15.577, lng: 73.869, battery: 85, status: "delivering", noiseLevel: 12 },
  { id: "WKP-02", lat: 15.580, lng: 73.872, battery: 42, status: "idle", noiseLevel: 10 },
  { id: "WKP-03", lat: 15.575, lng: 73.865, battery: 98, status: "delivering", noiseLevel: 14 },
];

export default function FleetTrackerPage() {
  const [bikes, setBikes] = useState<BikeStatus[]>(mockBikes);

  useEffect(() => {
    const interval = setInterval(() => {
      setBikes((current) =>
        current.map((b) => ({
          ...b,
          lat: b.lat + (Math.random() - 0.5) * 0.001,
          lng: b.lng + (Math.random() - 0.5) * 0.001,
          battery: Math.max(0, b.battery - Math.random() * 0.1),
        }))
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <MapIcon className="text-green-600 w-8 h-8" />
            Silent Fleet Tracker
            <span className="ml-4 bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full border border-orange-200 uppercase tracking-widest shadow-sm">Placeholder / Demo</span>
          </h1>
          <p className="text-gray-500 mt-2">
            Monitoring the acoustic impact and real-time position of our Aldona fleet.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm flex items-center gap-2 text-sm font-medium">
            <Shield className="text-blue-500 w-4 h-4" />
            Vibe Protection: <span className="text-green-600">ACTIVE</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gray-100 rounded-3xl h-[600px] relative overflow-hidden border-4 border-white shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/73.8691,15.5770,14,0/800x600?access_token=none')] bg-cover">
            {/* Simulation of bike markers */}
            {bikes.map((bike) => (
              <div
                key={bike.id}
                style={{
                  left: `${((bike.lng - 73.860) / 0.02) * 100}%`,
                  top: `${((15.585 - bike.lat) / 0.015) * 100}%`,
                }}
                className="absolute transition-all duration-1000 ease-linear"
              >
                <div className="relative group">
                  <div className="absolute -inset-4 bg-green-500/20 rounded-full animate-ping" />
                  <div className="bg-white p-2 rounded-full shadow-lg border-2 border-green-500 relative z-10 cursor-pointer">
                    <Bike size={16} className="text-green-600" />
                  </div>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-20">
                    {bike.id} ({bike.battery.toFixed(0)}%)
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/20">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Fleet Legend</h4>
            <div className="flex gap-4 items-center text-xs">
              <div className="flex items-center gap-2"><span className="w-3 h-3 bg-green-500 rounded-full" /> Active</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 bg-gray-400 rounded-full" /> Idle</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 bg-red-500 rounded-full" /> Low Battery</div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold px-2">Vehicle Status</h2>
          {bikes.map((bike) => (
            <div key={bike.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <Bike size={20} className="text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-bold">{bike.id}</h4>
                    <p className="text-[10px] text-gray-400 uppercase">{bike.status}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1 text-sm font-bold">
                    <Battery className={bike.battery < 20 ? "text-red-500" : "text-green-500"} size={16} />
                    {bike.battery.toFixed(0)}%
                  </div>
                  <span className="text-[10px] text-gray-400">Acoustics: {bike.noiseLevel}dB</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                <Wifi size={12} className="text-blue-500" />
                Signal: <span className="text-green-600 font-medium">Strong (4G Aldona-East)</span>
              </div>
            </div>
          ))}
          <button className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 text-sm font-medium hover:bg-gray-50 transition-colors">
            + Provision New E-Bike
          </button>
        </div>
      </div>
    </div>
  );
}
