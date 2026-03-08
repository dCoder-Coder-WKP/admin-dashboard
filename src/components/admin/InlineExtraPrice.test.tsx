import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InlineExtraPrice from './InlineExtraPrice';
import { updateExtraPrice } from '@/app/dashboard/toppings/actions';

vi.mock('@/app/dashboard/toppings/actions', () => ({
  updateExtraPrice: vi.fn(),
}));

describe('InlineExtraPrice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders initial price correctly', () => {
    render(<InlineExtraPrice extraId="e1" initialPrice={49} />);
    const input = screen.getByDisplayValue('49');
    expect(input).toBeInTheDocument();
  });

  it('does not call update on blur if price is unchanged', async () => {
    const user = userEvent.setup();
    render(<InlineExtraPrice extraId="e1" initialPrice={49} />);
    
    const input = screen.getByDisplayValue('49');
    await user.click(input);
    await user.tab();
    
    expect(updateExtraPrice).not.toHaveBeenCalled();
  });

  it('calls updateExtraPrice on blur if price changed', async () => {
    const user = userEvent.setup();
    vi.mocked(updateExtraPrice).mockResolvedValue(undefined);
    
    render(<InlineExtraPrice extraId="e1" initialPrice={49} />);
    
    const input = screen.getByDisplayValue('49');
    await user.clear(input);
    await user.type(input, '59');
    await user.tab();
    
    expect(updateExtraPrice).toHaveBeenCalledWith('e1', 59);
    
    await waitFor(() => {
      expect(screen.getByText('✓ Saved')).toBeInTheDocument();
    });
  });

  it('shows error state if update fails and reverts value', async () => {
    const user = userEvent.setup();
    vi.mocked(updateExtraPrice).mockRejectedValue(new Error('Failed'));
    
    render(<InlineExtraPrice extraId="e1" initialPrice={49} />);
    
    const input = screen.getByDisplayValue('49') as HTMLInputElement;
    await user.clear(input);
    await user.type(input, '59');
    await user.tab();
    
    expect(updateExtraPrice).toHaveBeenCalledWith('e1', 59);
    
    await waitFor(() => {
      expect(screen.getByText('Failed')).toBeInTheDocument();
    });
    
    expect(input.value).toBe('49');
  });
});
