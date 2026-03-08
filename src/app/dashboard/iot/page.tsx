"use client";

import React, { useState, useEffect } from "react";
import { getMockIotReadings, IotReading } from "@/lib/iot-mock";
import { Activity, Thermometer, Droplets, Zap } from "lucide-react";

export default function IotDashboardPage() {
  const [readings, setReadings] = useState<IotReading[]>([]);

  useEffect(() => {
    setReadings(getMockIotReadings());
    const interval = setInterval(() => {
      // Simulate slight fluctuations
      setReadings((current) =>
        current.map((r) => ({
          ...r,
          value: Number((r.value + (Math.random() - 0.5) * 0.2).toFixed(2)),
        }))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Zap className="text-yellow-500 w-8 h-8" />
          Artisanal IoT Quality War Room
        </h1>
        <p className="text-gray-500 mt-2">
          Real-time biological and thermal monitoring of the Carona bakery.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {readings.map((reading) => (
          <div
            key={reading.sensor_type}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${
                reading.sensor_type.includes('pH') ? 'bg-purple-100 text-purple-600' :
                reading.sensor_type.includes('Temp') ? 'bg-orange-100 text-orange-600' :
                'bg-blue-100 text-blue-600'
              }`}>
                {reading.sensor_type.includes('pH') ? <Activity size={24} /> :
                 reading.sensor_type.includes('Temp') ? <Thermometer size={24} /> :
                 <Droplets size={24} />}
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                reading.status === 'optimal' ? 'bg-green-100 text-green-700' :
                reading.status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {reading.status.toUpperCase()}
              </span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{reading.sensor_type}</h3>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-gray-900">{reading.value}</span>
              <span className="text-gray-500 text-lg">{reading.unit}</span>
            </div>
            <p className="text-gray-400 text-xs mt-2 flex items-center gap-1">
              Location: {reading.location}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-6">Fermentation Health Map</h2>
          <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200">
            <span className="text-gray-400">Live WebGL Heatmap Placeholder</span>
          </div>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-6">Oven Consistency Metrics</h2>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Oven Zone {i}</span>
                  <span className="text-gray-500">425°C Target</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full w-[95%] shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
