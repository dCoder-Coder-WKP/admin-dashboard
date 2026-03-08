import { describe, it, expect } from 'vitest';
import { getMockIotReadings } from './iot-mock';

describe('iot-mock generator', () => {
  it('should generate 4 readings matching expected schema', () => {
    const readings = getMockIotReadings();
    expect(readings.length).toBe(4);
    
    expect(readings[0].sensor_type).toBe('Fermentation pH');
    expect(readings[0].unit).toBe('pH');

    expect(readings[2].sensor_type).toContain('Oven Temp');
    expect(readings[2].unit).toBe('°C');
  });
});
