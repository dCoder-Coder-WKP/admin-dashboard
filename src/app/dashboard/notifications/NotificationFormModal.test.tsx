import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NotificationFormModal from './NotificationFormModal';
import { createNotification, updateNotification } from './actions';
import React from 'react';

vi.mock('./actions', () => ({
  createNotification: vi.fn(),
  updateNotification: vi.fn(),
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

describe('NotificationFormModal', () => {
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns null when closed', () => {
    const { container } = render(<NotificationFormModal open={false} onClose={onClose} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders broadcast form when open', () => {
    render(<NotificationFormModal open={true} onClose={onClose} />);
    expect(screen.getByText('Broadcast New Signal')).toBeInTheDocument();
    expect(screen.getByText('Broadcast')).toBeInTheDocument();
  });

  it('renders edit form with prefilled data', () => {
    const notification = {
      id: 'n1', title: 'Weekend Sale', body: '50% off', type: 'offer',
      is_active: true, pinned: false, expires_at: '2026-03-15T00:00:00Z'
    };
    render(<NotificationFormModal open={true} onClose={onClose} notification={notification} />);
    expect(screen.getByText('Edit Signal')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Weekend Sale')).toBeInTheDocument();
  });

  it('shows error if title is empty', async () => {
    const user = userEvent.setup();
    const toast = await import('react-hot-toast');

    render(<NotificationFormModal open={true} onClose={onClose} />);
    await user.click(screen.getByText('Broadcast'));
    
    expect(toast.default.error).toHaveBeenCalledWith('Title is required');
    expect(createNotification).not.toHaveBeenCalled();
  });

  it('calls createNotification on valid submit', async () => {
    const user = userEvent.setup();
    vi.mocked(createNotification).mockResolvedValue(undefined);

    render(<NotificationFormModal open={true} onClose={onClose} />);
    await user.type(screen.getByPlaceholderText('e.g. Weekend Special!'), 'Flash Sale');
    await user.click(screen.getByText('Broadcast'));
    
    expect(createNotification).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Flash Sale',
    }));
  });

  it('calls updateNotification when editing', async () => {
    const user = userEvent.setup();
    vi.mocked(updateNotification).mockResolvedValue(undefined);
    
    const notification = {
      id: 'n1', title: 'Weekend Sale', body: '50% off', type: 'offer',
      is_active: true, pinned: false, expires_at: null
    };
    render(<NotificationFormModal open={true} onClose={onClose} notification={notification} />);
    await user.click(screen.getByText('Update Signal'));
    
    expect(updateNotification).toHaveBeenCalledWith('n1', expect.objectContaining({
      title: 'Weekend Sale',
    }));
  });
});
