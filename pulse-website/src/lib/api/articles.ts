import { createClient } from '@/utils/supabase/server';
import { Article } from '@/types/database';

export const articlesApi = {
  getAll: async (): Promise<Article[]> => {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) {
        console.error('Error fetching articles:', error);
        throw new Error(`Failed to fetch articles: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Articles API error:', error);
      throw error;
    }
  },

  getBySlug: async (slug: string): Promise<Article | null> => {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null;
        }
        console.error('Error fetching article by slug:', error);
        throw new Error(`Failed to fetch article: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Articles API error:', error);
      return null;
    }
  },

  getByCategory: async (category: string): Promise<Article[]> => {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('category', category)
        .order('published_at', { ascending: false });

      if (error) {
        console.error('Error fetching articles by category:', error);
        throw new Error(
          `Failed to fetch articles by category: ${error.message}`
        );
      }

      return data || [];
    } catch (error) {
      console.error('Articles API error:', error);
      throw error;
    }
  },

  getFeatured: async (limit: number = 1): Promise<Article[]> => {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching featured articles:', error);
        throw new Error(`Failed to fetch featured articles: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Articles API error:', error);
      throw error;
    }
  },

  getRecent: async (
    limit: number = 10,
    offset: number = 0
  ): Promise<Article[]> => {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('published_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error fetching recent articles:', error);
        throw new Error(`Failed to fetch recent articles: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Articles API error:', error);
      throw error;
    }
  },

  search: async (query: string, limit: number = 20): Promise<Article[]> => {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .or(
          `title.ilike.%${query}%, content.ilike.%${query}%, summary.ilike.%${query}%`
        )
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error searching articles:', error);
        throw new Error(`Failed to search articles: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Articles API error:', error);
      throw error;
    }
  },

  create: async (
    article: Omit<Article, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Article> => {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('articles')
        .insert({
          ...article,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating article:', error);
        throw new Error(`Failed to create article: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Articles API error:', error);
      throw error;
    }
  },

  update: async (
    id: string,
    updates: Partial<Omit<Article, 'id' | 'created_at'>>
  ): Promise<Article> => {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('articles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating article:', error);
        throw new Error(`Failed to update article: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Articles API error:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const supabase = await createClient();
      const { error } = await supabase.from('articles').delete().eq('id', id);

      if (error) {
        console.error('Error deleting article:', error);
        throw new Error(`Failed to delete article: ${error.message}`);
      }
    } catch (error) {
      console.error('Articles API error:', error);
      throw error;
    }
  },
};
