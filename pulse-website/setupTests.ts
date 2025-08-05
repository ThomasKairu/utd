import '@testing-library/jest-dom';

// Mock fetch for tests
global.fetch = jest.fn();

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  usePathname: () => '/',
}));

// Mock Next.js server components
jest.mock('next/server', () => ({
  NextRequest: jest.fn().mockImplementation((url, init) => ({
    url,
    ...init,
    json: jest.fn(),
    text: jest.fn(),
  })),
  NextResponse: {
    json: jest.fn().mockImplementation((data, init) => ({
      json: () => Promise.resolve(data),
      status: init?.status || 200,
      ...init,
    })),
  },
}));
