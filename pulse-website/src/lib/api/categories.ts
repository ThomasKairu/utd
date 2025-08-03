import { createClient } from '@/utils/supabase/server';
import { Category } from '@/types/database';

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching categories:', error);
        throw new Error(`Failed to fetch categories: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Categories API error:', error);
      throw error;
    }
  },

  getBySlug: async (slug: string): Promise<Category | null> => {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null;
        }
        console.error('Error fetching category by slug:', error);
        throw new Error(`Failed to fetch category: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Categories API error:', error);
      return null;
    }
  },

  create: async (
    category: Omit<Category, 'id' | 'created_at'>
  ): Promise<Category> => {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('categories')
        .insert({
          ...category,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating category:', error);
        throw new Error(`Failed to create category: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Categories API error:', error);
      throw error;
    }
  },

  update: async (
    id: string,
    updates: Partial<Omit<Category, 'id' | 'created_at'>>
  ): Promise<Category> => {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating category:', error);
        throw new Error(`Failed to update category: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Categories API error:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const supabase = await createClient();
      const { error } = await supabase.from('categories').delete().eq('id', id);

      if (error) {
        console.error('Error deleting category:', error);
        throw new Error(`Failed to delete category: ${error.message}`);
      }
    } catch (error) {
      console.error('Categories API error:', error);
      throw error;
    }
  },
};
