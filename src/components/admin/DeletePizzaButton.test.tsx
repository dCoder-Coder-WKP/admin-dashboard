import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeletePizzaButton from './DeletePizzaButton';
import { deletePizza } from '@/app/dashboard/pizzas/actions';

vi.mock('@/app/dashboard/pizzas/actions', () => ({
  deletePizza: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: vi.fn(),
    push: vi.fn(),
  }),
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('DeletePizzaButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders a delete button', () => {
    render(<DeletePizzaButton pizzaId="p1" pizzaName="Margherita" />);
    expect(screen.getByTitle('Delete pizza')).toBeInTheDocument();
  });

  it('calls deletePizza when confirmed', async () => {
    const user = userEvent.setup();
    const confirmMock = vi.fn(() => true);
    vi.stubGlobal('confirm', confirmMock);
    vi.mocked(deletePizza).mockResolvedValue(undefined);
    
    render(<DeletePizzaButton pizzaId="p1" pizzaName="Margherita" />);
    
    await user.click(screen.getByTitle('Delete pizza'));
    
    expect(window.confirm).toHaveBeenCalledWith(expect.stringContaining('Margherita'));
    expect(deletePizza).toHaveBeenCalledWith('p1');
  });

  it('does not call deletePizza when cancelled', async () => {
    const user = userEvent.setup();
    const confirmMock = vi.fn(() => false);
    vi.stubGlobal('confirm', confirmMock);
    
    render(<DeletePizzaButton pizzaId="p1" pizzaName="Margherita" />);
    
    await user.click(screen.getByTitle('Delete pizza'));
    
    expect(deletePizza).not.toHaveBeenCalled();
  });
});
