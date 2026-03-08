import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SentimentPage from './page';
import React from 'react';

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  MessageSquare: () => <div data-testid="icon-message">MessageIcon</div>,
  Smile: () => <div data-testid="icon-smile">SmileIcon</div>,
  Frown: () => <div data-testid="icon-frown">FrownIcon</div>,
  Meh: () => <div data-testid="icon-meh">MehIcon</div>,
  TrendingUp: () => <div data-testid="icon-trending">TrendingIcon</div>,
}));

describe('SentimentPage', () => {
  it('renders the sentiment engine dashboard with mock data', () => {
    render(<SentimentPage />);
    
    expect(screen.getByText('AI Sentiment Engine')).toBeInTheDocument();
    
    // Check metrics
    expect(screen.getByText('Customer Satisfaction')).toBeInTheDocument();
    expect(screen.getByText('Conflict Zones')).toBeInTheDocument();

    // Check mock feedback text
    expect(screen.getByText(/The Chorizo pizza was incredible.*late/i)).toBeInTheDocument();
  });
});
