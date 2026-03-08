import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import IotDashboardPage from './page';
import React from 'react';

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  Activity: () => <div data-testid="icon-activity">ActivityIcon</div>,
  Thermometer: () => <div data-testid="icon-thermometer">ThermometerIcon</div>,
  Droplets: () => <div data-testid="icon-droplets">DropletsIcon</div>,
  Zap: () => <div data-testid="icon-zap">ZapIcon</div>,
}));

describe('IotDashboardPage', () => {
  it('renders the dashboard header and loads mock readings', () => {
    render(<IotDashboardPage />);
    
    // Header
    expect(screen.getByText('Artisanal IoT Quality War Room')).toBeInTheDocument();
    
    // Check for some mock data text
    expect(screen.getByText('Fermentation pH')).toBeInTheDocument();
    expect(screen.getByText('Oven Temp')).toBeInTheDocument();
    expect(screen.getByText('Fermentation Health Map')).toBeInTheDocument();
  });
});
