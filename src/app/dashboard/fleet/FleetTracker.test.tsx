import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import FleetTrackerPage from './page';
import React from 'react';

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  Bike: () => <div data-testid="icon-bike">BikeIcon</div>,
  Map: () => <div data-testid="icon-map">MapIcon</div>,
  Battery: () => <div data-testid="icon-battery">BatteryIcon</div>,
  Wifi: () => <div data-testid="icon-wifi">WifiIcon</div>,
  Shield: () => <div data-testid="icon-shield">ShieldIcon</div>,
}));

describe('FleetTrackerPage', () => {
  it('renders the fleet tracker page with mock data', () => {
    render(<FleetTrackerPage />);
    
    expect(screen.getByText('Silent Fleet Tracker')).toBeInTheDocument();
    
    // Check if mock bikes are rendered
    expect(screen.getByText('WKP-01')).toBeInTheDocument();
    expect(screen.getByText('WKP-02')).toBeInTheDocument();
    expect(screen.getByText('WKP-03')).toBeInTheDocument();
    
    expect(screen.getByText('Vehicle Status')).toBeInTheDocument();
  });
});
