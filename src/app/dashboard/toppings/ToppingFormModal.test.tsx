import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ToppingFormModal from './ToppingFormModal';
import { createTopping, updateTopping } from './actions';
import React from 'react';

vi.mock('./actions', () => ({
  createTopping: vi.fn(),
  updateTopping: vi.fn(),
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

vi.mock('lucide-react', () => ({
  X: () => <div data-testid="icon-x">X</div>,
}));

describe('ToppingFormModal', () => {
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns null when open is false', () => {
    const { container } = render(<ToppingFormModal open={false} onClose={onClose} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the create form when open with no topping', () => {
    render(<ToppingFormModal open={true} onClose={onClose} />);
    expect(screen.getByText('New Topping')).toBeInTheDocument();
    expect(screen.getByText('Add Topping')).toBeInTheDocument();
  });

  it('renders the edit form when a topping is passed', () => {
    const topping = { id: 't1', name: 'Mozzarella', category: 'cheese', is_veg: true, price_small: 30, price_medium: 50, price_large: 70 };
    render(<ToppingFormModal open={true} onClose={onClose} topping={topping} />);
    expect(screen.getByText('Edit Topping')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Mozzarella')).toBeInTheDocument();
    expect(screen.getByText('Update Topping')).toBeInTheDocument();
  });

  it('shows error toast if name is empty on submit', async () => {
    const user = userEvent.setup();
    const toast = await import('react-hot-toast');

    render(<ToppingFormModal open={true} onClose={onClose} />);
    
    // Clear the name field
    const nameInput = screen.getByPlaceholderText('e.g. Mozzarella');
    await user.clear(nameInput);
    
    // Submit
    await user.click(screen.getByText('Add Topping'));
    
    expect(toast.default.error).toHaveBeenCalledWith('Name is required');
    expect(createTopping).not.toHaveBeenCalled();
  });

  it('calls createTopping with form data on valid submit', async () => {
    const user = userEvent.setup();
    vi.mocked(createTopping).mockResolvedValue(undefined);

    render(<ToppingFormModal open={true} onClose={onClose} />);
    
    const nameInput = screen.getByPlaceholderText('e.g. Mozzarella');
    await user.type(nameInput, 'Pepperoni');
    await user.click(screen.getByText('Add Topping'));
    
    expect(createTopping).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Pepperoni',
    }));
  });

  it('calls updateTopping when editing an existing topping', async () => {
    const user = userEvent.setup();
    vi.mocked(updateTopping).mockResolvedValue(undefined);
    
    const topping = { id: 't1', name: 'Mozzarella', category: 'cheese', is_veg: true, price_small: 30, price_medium: 50, price_large: 70 };
    render(<ToppingFormModal open={true} onClose={onClose} topping={topping} />);
    
    await user.click(screen.getByText('Update Topping'));
    
    expect(updateTopping).toHaveBeenCalledWith('t1', expect.objectContaining({
      name: 'Mozzarella',
    }));
  });
});
