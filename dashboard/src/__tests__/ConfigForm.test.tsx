import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConfigForm } from '../components/ConfigForm';

describe('ConfigForm', () => {
  it('renders all input fields', () => {
    const mockSubmit = vi.fn();
    render(<ConfigForm onSubmit={mockSubmit} isLoading={false} />);

    expect(screen.getByLabelText(/GitLab URL/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Private Token/i)).toBeInTheDocument();
    expect(screen.getByText(/Connect to GitLab/i)).toBeInTheDocument();
  });

  it('has default GitLab URL value', () => {
    const mockSubmit = vi.fn();
    render(<ConfigForm onSubmit={mockSubmit} isLoading={false} />);

    const urlInput = screen.getByLabelText(/GitLab URL/i) as HTMLInputElement;
    expect(urlInput.value).toBe('https://gitlab.com');
  });

  it('updates input values on change', () => {
    const mockSubmit = vi.fn();
    render(<ConfigForm onSubmit={mockSubmit} isLoading={false} />);

    const tokenInput = screen.getByLabelText(/Private Token/i) as HTMLInputElement;
    fireEvent.change(tokenInput, { target: { value: 'test-token-123' } });
    
    expect(tokenInput.value).toBe('test-token-123');
  });

  it('disables submit button when loading', () => {
    const mockSubmit = vi.fn();
    render(<ConfigForm onSubmit={mockSubmit} isLoading={true} />);

    const submitButton = screen.getByRole('button');
    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when not loading', () => {
    const mockSubmit = vi.fn();
    render(<ConfigForm onSubmit={mockSubmit} isLoading={false} />);

    const submitButton = screen.getByRole('button');
    expect(submitButton).not.toBeDisabled();
  });
});
