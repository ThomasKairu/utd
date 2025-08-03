import { CATEGORIES, CATEGORY_FALLBACK_IMAGES } from '../config/sites';

export interface Article {
  title: string;
  link: string;
  pubDate: string;
  description?: string;
  guid?: string;
}

export interface ProcessedArticle {
  title: string;
  slug: string;
  content: string;
  summary: string;
  category: string;
  source_url: string;
  image_url: string;
  published_at: string;
  created_at: string;
}

export interface ScrapedContent {
  title: string;
  content: string;
  imageUrl?: string;
}

/**
 * Process article with AI using OpenRouter
 */
export async function processWithAI(
  article: Article,
  scrapedContent: ScrapedContent,
  apiKey: string
): Promise<ProcessedArticle> {
  const prompt = `First, classify the following article into ONE of these categories: [Politics, Business, Entertainment, Sports, Technology].

Then, rewrite this article for uniqueness, SEO optimization, and readability for a Kenyan audience. The rewrite must follow all on-page SEO rules and include a 'Why it matters' sentence and a 3-bullet-point 'The Big Picture' summary.

Here is the article:

Title: ${article.title}
Content: ${scrapedContent.content}`;

  // Try primary model first, then fallback with different API keys
  const models = [
    { 
      model: 'z-ai/glm-4.5-air:free', 
      key: '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'
    },
    { 
      model: 'google/gemma-3-27b-it:free', 
      key: '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'
    }
  ];

  for (let i = 0; i < models.length; i++) {
    try {
      const response = await callOpenRouter(prompt, models[i].model, models[i].key);
      return parseAIResponse(response, article, scrapedContent.imageUrl);
    } catch (error) {
      console.warn(`Model ${models[i].model} failed:`, error);
      if (i === models.length - 1) {
        throw new Error('All AI models failed to process the article');
      }
      continue;
    }
  }

  throw new Error('All AI models failed to process the article');
}

/**
 * Call OpenRouter API
 */
async function callOpenRouter(
  prompt: string,
  model: string,
  apiKey: string
): Promise<string> {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://pulse.utdnews.com',
      'X-Title': 'Pulse UTD News',
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: 'system',
          content: 'You are a professional Kenyan news editor. Always start your response with the category name on the first line, then provide the rewritten article with "Why it matters" and "The Big Picture" sections.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 2000,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error('Invalid response format from OpenRouter API');
  }

  return data.choices[0].message.content;
}

/**
 * Parse AI response and create processed article
 */
function parseAIResponse(
  text: string,
  article: Article,
  imageUrl?: string
): ProcessedArticle {
  const lines = text.split('\n');
  const category = lines[0].trim();
  const rewrittenContent = lines.slice(1).join('\n').trim();

  // Validate category
  const validCategories = Object.values(CATEGORIES);
  const finalCategory = validCategories.includes(category as any) 
    ? category 
    : CATEGORIES.BUSINESS; // Default fallback

  // Generate SEO-friendly slug
  const slug = generateSlug(article.title);

  // Determine final image URL with fallback
  const finalImageUrl = imageUrl || 
    CATEGORY_FALLBACK_IMAGES[finalCategory as keyof typeof CATEGORY_FALLBACK_IMAGES] ||
    CATEGORY_FALLBACK_IMAGES.LATEST;

  return {
    title: article.title,
    slug,
    content: rewrittenContent,
    summary: article.description || extractSummary(rewrittenContent),
    category: finalCategory,
    source_url: article.link,
    image_url: finalImageUrl,
    published_at: new Date(article.pubDate).toISOString(),
    created_at: new Date().toISOString(),
  };
}

/**
 * Generate SEO-friendly slug
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 100); // Limit length
}

/**
 * Extract summary from content if not provided
 */
function extractSummary(content: string): string {
  // Take first 2 sentences or 200 characters, whichever is shorter
  const sentences = content.split(/[.!?]+/);
  const firstTwoSentences = sentences.slice(0, 2).join('. ').trim();
  
  if (firstTwoSentences.length > 200) {
    return content.substring(0, 197) + '...';
  }
  
  return firstTwoSentences + (firstTwoSentences.endsWith('.') ? '' : '.');
}