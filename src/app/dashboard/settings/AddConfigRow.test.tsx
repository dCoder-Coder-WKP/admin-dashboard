import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddConfigRow from './AddConfigRow';
import { createSiteConfig } from './actions';
import React from 'react';

vi.mock('./actions', () => ({
  createSiteConfig: vi.fn(),
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
  Plus: () => <div data-testid="icon-plus">Plus</div>,
  Check: () => <div data-testid="icon-check">Check</div>,
  X: () => <div data-testid="icon-x">X</div>,
}));

describe('AddConfigRow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders add button initially', () => {
    render(<AddConfigRow />);
    expect(screen.getByText('Add New Config')).toBeInTheDocument();
  });

  it('opens the form when clicking add', async () => {
    const user = userEvent.setup();
    render(<AddConfigRow />);
    
    await user.click(screen.getByText('Add New Config'));
    expect(screen.getByPlaceholderText('e.g. my_setting')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. My Setting')).toBeInTheDocument();
  });

  it('shows error when key/label are empty', async () => {
    const user = userEvent.setup();
    const toast = await import('react-hot-toast');

    render(<AddConfigRow />);
    
    await user.click(screen.getByText('Add New Config'));
    await user.click(screen.getByTestId('icon-check'));
    
    expect(toast.default.error).toHaveBeenCalledWith('Key and Label are required');
    expect(createSiteConfig).not.toHaveBeenCalled();
  });

  it('calls createSiteConfig with valid data', async () => {
    const user = userEvent.setup();
    vi.mocked(createSiteConfig).mockResolvedValue(undefined);

    render(<AddConfigRow />);
    
    await user.click(screen.getByText('Add New Config'));
    await user.type(screen.getByPlaceholderText('e.g. my_setting'), 'test_key');
    await user.type(screen.getByPlaceholderText('e.g. My Setting'), 'Test Label');
    await user.type(screen.getByPlaceholderText('Value'), 'test_val');
    await user.click(screen.getByTestId('icon-check'));
    
    expect(createSiteConfig).toHaveBeenCalledWith('test_key', 'test_val', 'Test Label', 'text');
  });
});
