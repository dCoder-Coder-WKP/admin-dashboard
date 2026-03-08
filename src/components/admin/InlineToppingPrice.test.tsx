import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InlineToppingPrice from './InlineToppingPrice';
import { updateToppingPrice } from '@/app/dashboard/toppings/actions';

vi.mock('@/app/dashboard/toppings/actions', () => ({
  updateToppingPrice: vi.fn(),
}));

describe('InlineToppingPrice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders initial price correctly', () => {
    render(<InlineToppingPrice toppingId="t1" size="small" initialPrice={30} />);
    const input = screen.getByDisplayValue('30');
    expect(input).toBeInTheDocument();
  });

  it('does not call update on blur if price is unchanged', async () => {
    const user = userEvent.setup();
    render(<InlineToppingPrice toppingId="t1" size="small" initialPrice={30} />);
    
    const input = screen.getByDisplayValue('30');
    await user.click(input);
    await user.tab();
    
    expect(updateToppingPrice).not.toHaveBeenCalled();
  });

  it('calls updateToppingPrice on blur if price changed, showing saved state', async () => {
    const user = userEvent.setup();
    vi.mocked(updateToppingPrice).mockResolvedValue(undefined);
    
    render(<InlineToppingPrice toppingId="t1" size="medium" initialPrice={50} />);
    
    const input = screen.getByDisplayValue('50');
    await user.clear(input);
    await user.type(input, '60');
    await user.tab();
    
    expect(updateToppingPrice).toHaveBeenCalledWith('t1', 'medium', 60);
    
    await waitFor(() => {
      expect(screen.getByText('✓ Saved')).toBeInTheDocument();
    });
  });

  it('shows error state if update fails and reverts value', async () => {
    const user = userEvent.setup();
    vi.mocked(updateToppingPrice).mockRejectedValue(new Error('Failed'));
    
    render(<InlineToppingPrice toppingId="t1" size="large" initialPrice={70} />);
    
    const input = screen.getByDisplayValue('70') as HTMLInputElement;
    await user.clear(input);
    await user.type(input, '80');
    await user.tab();
    
    expect(updateToppingPrice).toHaveBeenCalledWith('t1', 'large', 80);
    
    await waitFor(() => {
      expect(screen.getByText('Failed')).toBeInTheDocument();
    });
    
    expect(input.value).toBe('70');
  });
});
