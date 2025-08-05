import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// Required for static export
export const dynamic = 'force-static';
export const revalidate = false;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ error: 'Query must be at least 2 characters' }, { status: 400 });
    }

    const supabase = await createClient();

    // Perform full-text search across title, summary, and content
    const { data: articles, error } = await supabase
      .from('articles')
      .select('id, title, slug, summary, category, published_at, image_url')
      .or(`title.ilike.%${query}%,summary.ilike.%${query}%,content.ilike.%${query}%`)
      .order('published_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Search error:', error);
      return NextResponse.json({ error: 'Search failed' }, { status: 500 });
    }

    // Add search ranking based on relevance
    const rankedArticles = articles?.map(article => {
      let score = 0;
      const lowerQuery = query.toLowerCase();
      const lowerTitle = article.title.toLowerCase();
      const lowerSummary = (article.summary || '').toLowerCase();

      // Title matches get highest score
      if (lowerTitle.includes(lowerQuery)) {
        score += 10;
        // Exact title match gets bonus
        if (lowerTitle === lowerQuery) score += 20;
        // Title starts with query gets bonus
        if (lowerTitle.startsWith(lowerQuery)) score += 15;
      }

      // Summary matches get medium score
      if (lowerSummary.includes(lowerQuery)) {
        score += 5;
      }

      // Recent articles get slight boost
      const daysSincePublished = Math.floor(
        (Date.now() - new Date(article.published_at).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysSincePublished < 7) score += 2;
      if (daysSincePublished < 1) score += 3;

      return { ...article, relevanceScore: score };
    }) || [];

    // Sort by relevance score, then by date
    rankedArticles.sort((a, b) => {
      if (a.relevanceScore !== b.relevanceScore) {
        return b.relevanceScore - a.relevanceScore;
      }
      return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
    });

    // Remove the score from the response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const results = rankedArticles.map(({ relevanceScore: _, ...article }) => article);

    return NextResponse.json(results);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, filters } = body;

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ error: 'Query must be at least 2 characters' }, { status: 400 });
    }

    const supabase = await createClient();
    let queryBuilder = supabase
      .from('articles')
      .select('id, title, slug, summary, category, published_at, image_url');

    // Apply search query
    queryBuilder = queryBuilder.or(`title.ilike.%${query}%,summary.ilike.%${query}%,content.ilike.%${query}%`);

    // Apply filters if provided
    if (filters?.category && filters.category !== 'all') {
      queryBuilder = queryBuilder.eq('category', filters.category);
    }

    if (filters?.dateFrom) {
      queryBuilder = queryBuilder.gte('published_at', filters.dateFrom);
    }

    if (filters?.dateTo) {
      queryBuilder = queryBuilder.lte('published_at', filters.dateTo);
    }

    // Apply pagination
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const offset = (page - 1) * limit;

    const { data: articles, error, count } = await queryBuilder
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Advanced search error:', error);
      return NextResponse.json({ error: 'Search failed' }, { status: 500 });
    }

    return NextResponse.json({
      articles: articles || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Advanced search API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}