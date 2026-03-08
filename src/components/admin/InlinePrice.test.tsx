import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InlinePrice from './InlinePrice';
import { updatePizzaPrice } from '@/app/dashboard/pizzas/actions';

vi.mock('@/app/dashboard/pizzas/actions', () => ({
  updatePizzaPrice: vi.fn(),
}));

describe('InlinePrice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders initial price correctly', () => {
    render(<InlinePrice pizzaId="p1" size="medium" initialPrice={200} />);
    const input = screen.getByDisplayValue('200');
    expect(input).toBeInTheDocument();
  });

  it('does not call update on blur if price is unchanged', async () => {
    const user = userEvent.setup();
    render(<InlinePrice pizzaId="p1" size="medium" initialPrice={200} />);
    
    const input = screen.getByDisplayValue('200');
    await user.click(input);
    await user.tab(); // blur
    
    expect(updatePizzaPrice).not.toHaveBeenCalled();
  });

  it('calls updatePizzaPrice on blur if price changed, showing saved state', async () => {
    const user = userEvent.setup();
    vi.mocked(updatePizzaPrice).mockResolvedValue(undefined);
    
    render(<InlinePrice pizzaId="p1" size="medium" initialPrice={200} />);
    
    const input = screen.getByDisplayValue('200');
    await user.clear(input);
    await user.type(input, '250');
    await user.tab(); // blur
    
    expect(updatePizzaPrice).toHaveBeenCalledWith('p1', 'medium', 250);
    
    await waitFor(() => {
      expect(screen.getByText('✓ Saved')).toBeInTheDocument();
    });
  });

  it('shows error state if update fails and reverts value', async () => {
    const user = userEvent.setup();
    vi.mocked(updatePizzaPrice).mockRejectedValue(new Error('Failed'));
    
    render(<InlinePrice pizzaId="p1" size="medium" initialPrice={200} />);
    
    const input = screen.getByDisplayValue('200') as HTMLInputElement;
    await user.clear(input);
    await user.type(input, '250');
    await user.tab(); // blur
    
    expect(updatePizzaPrice).toHaveBeenCalledWith('p1', 'medium', 250);
    
    await waitFor(() => {
      expect(screen.getByText('Failed')).toBeInTheDocument();
    });
    
    // Should revert back to 200
    expect(input.value).toBe('200');
  });
});
