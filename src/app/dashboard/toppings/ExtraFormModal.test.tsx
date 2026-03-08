import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExtraFormModal from './ExtraFormModal';
import { createExtra, updateExtra } from './actions';
import React from 'react';

vi.mock('./actions', () => ({
  createExtra: vi.fn(),
  updateExtra: vi.fn(),
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

const categories = [
  { id: 'c1', label: 'Sides' },
  { id: 'c2', label: 'Desserts' },
];

describe('ExtraFormModal', () => {
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns null when closed', () => {
    const { container } = render(<ExtraFormModal open={false} onClose={onClose} categories={categories} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders create form when open', () => {
    render(<ExtraFormModal open={true} onClose={onClose} categories={categories} />);
    expect(screen.getByText('New Extra')).toBeInTheDocument();
    expect(screen.getByText('Add Extra')).toBeInTheDocument();
  });

  it('renders edit form with prefilled data', () => {
    const extra = { id: 'e1', name: 'Garlic Bread', category_id: 'c1', price: 99, is_veg: true };
    render(<ExtraFormModal open={true} onClose={onClose} extra={extra} categories={categories} />);
    expect(screen.getByText('Edit Extra')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Garlic Bread')).toBeInTheDocument();
  });

  it('shows error if name empty on submit', async () => {
    const user = userEvent.setup();
    const toast = await import('react-hot-toast');

    render(<ExtraFormModal open={true} onClose={onClose} categories={categories} />);
    
    const nameInput = screen.getByPlaceholderText('e.g. Garlic Bread');
    await user.clear(nameInput);
    await user.click(screen.getByText('Add Extra'));
    
    expect(toast.default.error).toHaveBeenCalledWith('Name is required');
    expect(createExtra).not.toHaveBeenCalled();
  });

  it('calls createExtra on valid submit', async () => {
    const user = userEvent.setup();
    vi.mocked(createExtra).mockResolvedValue(undefined);

    render(<ExtraFormModal open={true} onClose={onClose} categories={categories} />);
    
    await user.type(screen.getByPlaceholderText('e.g. Garlic Bread'), 'Brownie');
    await user.click(screen.getByText('Add Extra'));
    
    expect(createExtra).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Brownie',
    }));
  });

  it('calls updateExtra when editing', async () => {
    const user = userEvent.setup();
    vi.mocked(updateExtra).mockResolvedValue(undefined);
    
    const extra = { id: 'e1', name: 'Garlic Bread', category_id: 'c1', price: 99, is_veg: true };
    render(<ExtraFormModal open={true} onClose={onClose} extra={extra} categories={categories} />);
    
    await user.click(screen.getByText('Update Extra'));
    
    expect(updateExtra).toHaveBeenCalledWith('e1', expect.objectContaining({
      name: 'Garlic Bread',
    }));
  });
});
