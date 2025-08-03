import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ThemeToggle, { SimpleThemeToggle } from '../ThemeToggle';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

const ThemeToggleWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('ThemeToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('renders theme toggle button', () => {
    render(
      <ThemeToggleWrapper>
        <ThemeToggle />
      </ThemeToggleWrapper>
    );

    expect(
      screen.getByRole('button', { name: /toggle theme/i })
    ).toBeInTheDocument();
  });

  it('opens dropdown when clicked', async () => {
    const user = userEvent.setup();

    render(
      <ThemeToggleWrapper>
        <ThemeToggle />
      </ThemeToggleWrapper>
    );

    const button = screen.getByRole('button', { name: /toggle theme/i });
    await user.click(button);

    expect(screen.getByText('Light')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();
    expect(screen.getByText('System')).toBeInTheDocument();
  });

  it('changes theme when option is selected', async () => {
    const user = userEvent.setup();

    render(
      <ThemeToggleWrapper>
        <ThemeToggle />
      </ThemeToggleWrapper>
    );

    const button = screen.getByRole('button', { name: /toggle theme/i });
    await user.click(button);

    const darkOption = screen.getByText('Dark');
    await user.click(darkOption);

    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
  });

  it('closes dropdown when clicking outside', async () => {
    const user = userEvent.setup();

    render(
      <div>
        <ThemeToggleWrapper>
          <ThemeToggle />
        </ThemeToggleWrapper>
        <div data-testid="outside">Outside element</div>
      </div>
    );

    const button = screen.getByRole('button', { name: /toggle theme/i });
    await user.click(button);

    expect(screen.getByText('Light')).toBeInTheDocument();

    const outside = screen.getByTestId('outside');
    await user.click(outside);

    expect(screen.queryByText('Light')).not.toBeInTheDocument();
  });

  it('shows current theme selection', async () => {
    const user = userEvent.setup();
    localStorageMock.getItem.mockReturnValue('dark');

    render(
      <ThemeToggleWrapper>
        <ThemeToggle />
      </ThemeToggleWrapper>
    );

    const button = screen.getByRole('button', { name: /toggle theme/i });
    await user.click(button);

    // Check if dark theme is marked as selected
    const darkOption = screen.getByText('Dark').closest('button');
    expect(darkOption).toHaveClass('bg-blue-50');
  });
});

describe('SimpleThemeToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('renders simple theme toggle button', () => {
    render(
      <ThemeToggleWrapper>
        <SimpleThemeToggle />
      </ThemeToggleWrapper>
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('toggles between light and dark themes', async () => {
    const user = userEvent.setup();

    render(
      <ThemeToggleWrapper>
        <SimpleThemeToggle />
      </ThemeToggleWrapper>
    );

    const button = screen.getByRole('button');
    await user.click(button);

    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
  });

  it('shows correct icon for current theme', () => {
    localStorageMock.getItem.mockReturnValue('dark');

    render(
      <ThemeToggleWrapper>
        <SimpleThemeToggle />
      </ThemeToggleWrapper>
    );

    // Should show sun icon when in dark mode (to switch to light)
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title', expect.stringContaining('light'));
  });
});
