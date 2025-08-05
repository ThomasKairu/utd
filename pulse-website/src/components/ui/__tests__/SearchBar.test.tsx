import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '../SearchBar';

// Mock fetch
global.fetch = jest.fn();

const mockOnSearch = jest.fn();
const mockOnResults = jest.fn();

describe('SearchBar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockClear();
  });

  it('renders search input with placeholder', () => {
    render(
      <SearchBar
        onSearch={mockOnSearch}
        onResults={mockOnResults}
        placeholder="Search articles..."
      />
    );

    expect(
      screen.getByPlaceholderText('Search articles...')
    ).toBeInTheDocument();
  });

  it('calls onSearch when form is submitted', async () => {
    const user = userEvent.setup();

    render(<SearchBar onSearch={mockOnSearch} onResults={mockOnResults} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'test query');
    await user.keyboard('{Enter}');

    expect(mockOnSearch).toHaveBeenCalledWith('test query');
  });

  it('performs debounced search on input change', async () => {
    const user = userEvent.setup();
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: '1', title: 'Test Article' }],
    });

    render(<SearchBar onSearch={mockOnSearch} onResults={mockOnResults} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'test');

    // Wait for debounced search
    await waitFor(
      () => {
        expect(fetch).toHaveBeenCalledWith('/api/search?q=test');
      },
      { timeout: 500 }
    );
  });

  it('shows loading state during search', async () => {
    const user = userEvent.setup();
    (fetch as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    render(<SearchBar onSearch={mockOnSearch} onResults={mockOnResults} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'test');

    await waitFor(() => {
      expect(screen.getByText('Searching...')).toBeInTheDocument();
    });
  });

  it('displays search results', async () => {
    const user = userEvent.setup();
    const mockResults = [
      {
        id: '1',
        title: 'Test Article',
        slug: 'test-article',
        summary: 'Test summary',
        category: 'Technology',
        published_at: '2024-01-01T00:00:00Z',
      },
    ];

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResults,
    });

    render(<SearchBar onSearch={mockOnSearch} onResults={mockOnResults} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'test');

    await waitFor(() => {
      expect(screen.getByText('Test Article')).toBeInTheDocument();
      expect(screen.getByText('Test summary')).toBeInTheDocument();
    });
  });

  it('shows no results message when search returns empty', async () => {
    const user = userEvent.setup();
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<SearchBar onSearch={mockOnSearch} onResults={mockOnResults} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'nonexistent');

    await waitFor(() => {
      expect(screen.getByText(/No articles found/)).toBeInTheDocument();
    });
  });

  it('clears search when clear button is clicked', async () => {
    const user = userEvent.setup();

    render(<SearchBar onSearch={mockOnSearch} onResults={mockOnResults} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'test');

    const clearButton = screen.getByRole('button', { name: /clear/i });
    await user.click(clearButton);

    expect(input).toHaveValue('');
  });

  it('highlights search terms in results', async () => {
    const user = userEvent.setup();
    const mockResults = [
      {
        id: '1',
        title: 'Test Article with keyword',
        slug: 'test-article',
        summary: 'This contains the keyword',
        category: 'Technology',
        published_at: '2024-01-01T00:00:00Z',
      },
    ];

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResults,
    });

    render(<SearchBar onSearch={mockOnSearch} onResults={mockOnResults} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'keyword');

    await waitFor(() => {
      const highlights = screen.getAllByText('keyword');
      expect(highlights.length).toBeGreaterThan(0);
      // Check if the text is wrapped in a mark element
      expect(highlights[0].tagName).toBe('MARK');
    });
  });

  it('handles search API errors gracefully', async () => {
    const user = userEvent.setup();
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    render(<SearchBar onSearch={mockOnSearch} onResults={mockOnResults} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'test');

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Search error:',
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });
});
