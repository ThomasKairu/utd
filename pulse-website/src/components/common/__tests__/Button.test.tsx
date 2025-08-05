import React from 'react';
import { render, screen } from '@testing-library/react';
import Button from '@/components/common/Button';

describe('Button', () => {
  it('renders a button with the correct text', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('applies the correct variant class', () => {
    render(<Button variant="secondary">Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toHaveClass('bg-white text-primary border border-primary');
  });

  it('applies the correct size class', () => {
    render(<Button size="lg">Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toHaveClass('px-6 py-3 text-lg');
  });

  it('disables the button when loading', () => {
    render(<Button loading>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeDisabled();
  });
});
