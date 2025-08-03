import { ProcessedArticle } from './ai';

/**
 * Save processed article to Supabase database
 */
export async function saveToSupabase(
  article: ProcessedArticle,
  supabaseUrl: string,
  serviceKey: string
): Promise<void> {
  const url = `${supabaseUrl}/rest/v1/articles`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceKey}`,
        'apikey': serviceKey,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify(article),
    });

    if (!response.ok) {
      const errorText = await response.text();
      
      // Handle duplicate key errors gracefully
      if (response.status === 409 || errorText.includes('duplicate key')) {
        console.warn(`⚠️ Article already exists: ${article.title}`);
        return;
      }
      
      throw new Error(`Supabase error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    console.log(`✅ Saved to database: ${article.title}`);
  } catch (error) {
    console.error(`❌ Failed to save article "${article.title}":`, error);
    throw error;
  }
}

/**
 * Check if article already exists in database
 */
export async function articleExists(
  sourceUrl: string,
  supabaseUrl: string,
  serviceKey: string
): Promise<boolean> {
  try {
    const url = `${supabaseUrl}/rest/v1/articles?source_url=eq.${encodeURIComponent(sourceUrl)}&select=id`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${serviceKey}`,
        'apikey': serviceKey,
      },
    });

    if (!response.ok) {
      console.warn(`Failed to check article existence: ${response.status}`);
      return false;
    }

    const data = await response.json();
    return Array.isArray(data) && data.length > 0;
  } catch (error) {
    console.warn('Error checking article existence:', error);
    return false;
  }
}

/**
 * Get processing statistics
 */
export async function getProcessingStats(
  supabaseUrl: string,
  serviceKey: string
): Promise<{
  totalArticles: number;
  todayArticles: number;
  lastProcessed: string | null;
}> {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Get total count
    const totalResponse = await fetch(
      `${supabaseUrl}/rest/v1/articles?select=count`,
      {
        headers: {
          'Authorization': `Bearer ${serviceKey}`,
          'apikey': serviceKey,
          'Prefer': 'count=exact',
        },
      }
    );

    // Get today's count
    const todayResponse = await fetch(
      `${supabaseUrl}/rest/v1/articles?created_at=gte.${today}T00:00:00&select=count`,
      {
        headers: {
          'Authorization': `Bearer ${serviceKey}`,
          'apikey': serviceKey,
          'Prefer': 'count=exact',
        },
      }
    );

    // Get last processed article
    const lastResponse = await fetch(
      `${supabaseUrl}/rest/v1/articles?select=created_at&order=created_at.desc&limit=1`,
      {
        headers: {
          'Authorization': `Bearer ${serviceKey}`,
          'apikey': serviceKey,
        },
      }
    );

    const totalCount = parseInt(totalResponse.headers.get('content-range')?.split('/')[1] || '0');
    const todayCount = parseInt(todayResponse.headers.get('content-range')?.split('/')[1] || '0');
    
    const lastData = await lastResponse.json();
    const lastProcessed = Array.isArray(lastData) && lastData.length > 0 
      ? lastData[0].created_at 
      : null;

    return {
      totalArticles: totalCount,
      todayArticles: todayCount,
      lastProcessed,
    };
  } catch (error) {
    console.error('Failed to get processing stats:', error);
    return {
      totalArticles: 0,
      todayArticles: 0,
      lastProcessed: null,
    };
  }
}