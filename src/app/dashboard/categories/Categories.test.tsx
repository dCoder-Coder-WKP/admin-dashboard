import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CategoriesClient from './CategoriesClient';
import { createCategory, deleteCategory } from './actions';
import React from 'react';

vi.mock('./actions', () => ({
  createCategory: vi.fn(),
  deleteCategory: vi.fn(),
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
  Edit2: () => <div data-testid="icon-edit">Edit</div>,
  Trash2: () => <div data-testid="icon-trash">Trash</div>,
  Check: () => <div data-testid="icon-check">Check</div>,
  X: () => <div data-testid="icon-x">X</div>,
  Plus: () => <div data-testid="icon-plus">Plus</div>,
}));

const categories = [
  { id: 'c1', label: 'Classic Pizzas', sort_order: 0 },
  { id: 'c2', label: 'Premium Pizzas', sort_order: 1 },
];

describe('CategoriesClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the categories table', () => {
    render(<CategoriesClient categories={categories} />);
    expect(screen.getByText('Categories')).toBeInTheDocument();
    expect(screen.getByText('Classic Pizzas')).toBeInTheDocument();
    expect(screen.getByText('Premium Pizzas')).toBeInTheDocument();
  });

  it('shows empty state when no categories', () => {
    render(<CategoriesClient categories={[]} />);
    expect(screen.getByText('No categories found.')).toBeInTheDocument();
  });

  it('opens add form when clicking Add Category', async () => {
    const user = userEvent.setup();
    render(<CategoriesClient categories={categories} />);
    
    await user.click(screen.getByText('Add Category'));
    expect(screen.getByPlaceholderText('Category name')).toBeInTheDocument();
  });

  it('calls createCategory on add form submit', async () => {
    const user = userEvent.setup();
    vi.mocked(createCategory).mockResolvedValue(undefined);
    
    render(<CategoriesClient categories={categories} />);
    
    await user.click(screen.getByText('Add Category'));
    const input = screen.getByPlaceholderText('Category name');
    await user.type(input, 'Gourmet');
    
    // Click the check/save button
    const checkButtons = screen.getAllByTestId('icon-check');
    await user.click(checkButtons[checkButtons.length - 1]);
    
    expect(createCategory).toHaveBeenCalledWith('Gourmet', expect.any(Number));
  });

  it('shows error when trying to add with empty label', async () => {
    const user = userEvent.setup();
    const toast = await import('react-hot-toast');

    render(<CategoriesClient categories={categories} />);
    
    await user.click(screen.getByText('Add Category'));
    
    // Click save without entering anything
    const checkButtons = screen.getAllByTestId('icon-check');
    await user.click(checkButtons[checkButtons.length - 1]);
    
    expect(toast.default.error).toHaveBeenCalledWith('Label is required');
    expect(createCategory).not.toHaveBeenCalled();
  });

  it('calls deleteCategory when confirmed', async () => {
    const user = userEvent.setup();
    const confirmMock = vi.fn(() => true);
    vi.stubGlobal('confirm', confirmMock);
    vi.mocked(deleteCategory).mockResolvedValue(undefined);
    
    render(<CategoriesClient categories={categories} />);
    
    const trashButtons = screen.getAllByTestId('icon-trash');
    await user.click(trashButtons[0]);
    
    expect(deleteCategory).toHaveBeenCalledWith('c1');
  });
});
