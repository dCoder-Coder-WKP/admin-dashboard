export interface IotReading {
  sensor_type: string;
  location: string;
  value: number;
  unit: string;
  status: 'optimal' | 'warning' | 'critical';
}

export function getMockIotReadings(): IotReading[] {
  return [
    {
      sensor_type: 'Fermentation pH',
      location: 'Prep Lab Fridge A',
      value: 4.5,
      unit: 'pH',
      status: 'optimal',
    },
    {
      sensor_type: 'Fermentation Temp',
      location: 'Prep Lab Fridge A',
      value: 4.2,
      unit: '°C',
      status: 'optimal',
    },
    {
      sensor_type: 'Oven Temp',
      location: 'Main Wood-Fired Oven',
      value: 425.8,
      unit: '°C',
      status: 'optimal',
    },
    {
      sensor_type: 'Humidity',
      location: 'Dough Proofing Room',
      value: 68,
      unit: '%',
      status: 'warning',
    },
  ];
}
