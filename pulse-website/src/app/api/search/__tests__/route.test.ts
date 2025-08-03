import { GET, POST } from '../route';
import { NextRequest } from 'next/server';

// Mock Supabase client
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockSupabaseClient: any = {
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  or: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  gte: jest.fn().mockReturnThis(),
  lte: jest.fn().mockReturnThis(),
  order: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  range: jest.fn().mockReturnThis(),
};

jest.mock('@/utils/supabase/server', () => ({
  createClient: jest.fn(() => Promise.resolve(mockSupabaseClient)),
}));

describe('/api/search', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/search', () => {
    it('returns 400 for missing query parameter', async () => {
      const request = new NextRequest('http://localhost:3000/api/search');
      const response = await GET(request);
      
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Query must be at least 2 characters');
    });

    it('returns 400 for short query parameter', async () => {
      const request = new NextRequest('http://localhost:3000/api/search?q=a');
      const response = await GET(request);
      
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Query must be at least 2 characters');
    });

    it('performs search and returns results', async () => {
      const mockArticles = [
        {
          id: '1',
          title: 'Test Article',
          slug: 'test-article',
          summary: 'Test summary',
          category: 'Technology',
          published_at: '2024-01-01T00:00:00Z',
          image_url: 'https://example.com/image.jpg'
        }
      ];

      mockSupabaseClient.or.mockResolvedValueOnce({
        data: mockArticles,
        error: null,
      });

      const request = new NextRequest('http://localhost:3000/api/search?q=test');
      const response = await GET(request);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual(mockArticles);
      
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('articles');
      expect(mockSupabaseClient.select).toHaveBeenCalledWith('id, title, slug, summary, category, published_at, image_url');
      expect(mockSupabaseClient.or).toHaveBeenCalledWith('title.ilike.%test%,summary.ilike.%test%,content.ilike.%test%');
      expect(mockSupabaseClient.order).toHaveBeenCalledWith('published_at', { ascending: false });
      expect(mockSupabaseClient.limit).toHaveBeenCalledWith(10);
    });

    it('handles database errors gracefully', async () => {
      mockSupabaseClient.or.mockResolvedValueOnce({
        data: null,
        error: { message: 'Database error' },
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const request = new NextRequest('http://localhost:3000/api/search?q=test');
      const response = await GET(request);
      
      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Search failed');
      
      expect(consoleSpy).toHaveBeenCalledWith('Search error:', { message: 'Database error' });
      consoleSpy.mockRestore();
    });

    it('ranks results by relevance', async () => {
      const mockArticles = [
        {
          id: '1',
          title: 'Test Article',
          slug: 'test-article',
          summary: 'Some summary',
          category: 'Technology',
          published_at: '2024-01-01T00:00:00Z',
          image_url: null
        },
        {
          id: '2',
          title: 'Another Article',
          slug: 'another-article',
          summary: 'Test summary with keyword',
          category: 'Business',
          published_at: '2024-01-02T00:00:00Z',
          image_url: null
        }
      ];

      mockSupabaseClient.or.mockResolvedValueOnce({
        data: mockArticles,
        error: null,
      });

      const request = new NextRequest('http://localhost:3000/api/search?q=test');
      const response = await GET(request);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      
      // First article should rank higher due to title match
      expect(data[0].id).toBe('1');
      expect(data[1].id).toBe('2');
    });
  });

  describe('POST /api/search', () => {
    it('returns 400 for missing query in body', async () => {
      const request = new NextRequest('http://localhost:3000/api/search', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' },
      });
      
      const response = await POST(request);
      
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Query must be at least 2 characters');
    });

    it('performs advanced search with filters', async () => {
      const mockArticles = [
        {
          id: '1',
          title: 'Test Article',
          slug: 'test-article',
          summary: 'Test summary',
          category: 'Technology',
          published_at: '2024-01-01T00:00:00Z',
          image_url: null
        }
      ];

      mockSupabaseClient.range.mockResolvedValueOnce({
        data: mockArticles,
        error: null,
        count: 1,
      });

      const request = new NextRequest('http://localhost:3000/api/search', {
        method: 'POST',
        body: JSON.stringify({
          query: 'test',
          filters: {
            category: 'Technology',
            dateFrom: '2024-01-01',
            dateTo: '2024-12-31',
            page: 1,
            limit: 20,
          },
        }),
        headers: { 'Content-Type': 'application/json' },
      });
      
      const response = await POST(request);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data.articles).toEqual(mockArticles);
      expect(data.pagination).toEqual({
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
      });
      
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('category', 'Technology');
      expect(mockSupabaseClient.gte).toHaveBeenCalledWith('published_at', '2024-01-01');
      expect(mockSupabaseClient.lte).toHaveBeenCalledWith('published_at', '2024-12-31');
      expect(mockSupabaseClient.range).toHaveBeenCalledWith(0, 19);
    });

    it('applies pagination correctly', async () => {
      const mockArticles = Array.from({ length: 20 }, (_, i) => ({
        id: `${i + 1}`,
        title: `Article ${i + 1}`,
        slug: `article-${i + 1}`,
        summary: 'Test summary',
        category: 'Technology',
        published_at: '2024-01-01T00:00:00Z',
        image_url: null
      }));

      mockSupabaseClient.range.mockResolvedValueOnce({
        data: mockArticles,
        error: null,
        count: 100,
      });

      const request = new NextRequest('http://localhost:3000/api/search', {
        method: 'POST',
        body: JSON.stringify({
          query: 'test',
          filters: {
            page: 3,
            limit: 20,
          },
        }),
        headers: { 'Content-Type': 'application/json' },
      });
      
      const response = await POST(request);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data.pagination).toEqual({
        page: 3,
        limit: 20,
        total: 100,
        totalPages: 5,
      });
      
      // Page 3 with limit 20 should start at offset 40
      expect(mockSupabaseClient.range).toHaveBeenCalledWith(40, 59);
    });

    it('handles malformed JSON gracefully', async () => {
      const request = new NextRequest('http://localhost:3000/api/search', {
        method: 'POST',
        body: 'invalid json',
        headers: { 'Content-Type': 'application/json' },
      });
      
      const response = await POST(request);
      
      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Internal server error');
    });
  });
});