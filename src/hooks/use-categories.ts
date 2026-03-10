"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { type Category, type CategoryFormData } from "@/types";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("created_at", { ascending: true });
    setCategories(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const createCategory = async (
    form: CategoryFormData,
  ): Promise<Category | null> => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("categories")
      .insert({ user_id: user.id, name: form.name.trim(), color: form.color })
      .select()
      .single();

    if (error || !data) return null;
    setCategories((prev) => [...prev, data]);
    return data;
  };

  const updateCategory = async (
    id: string,
    form: CategoryFormData,
  ): Promise<boolean> => {
    const supabase = createClient();
    const { error } = await supabase
      .from("categories")
      .update({ name: form.name.trim(), color: form.color })
      .eq("id", id);

    if (error) return false;
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...form } : c)),
    );
    return true;
  };

  const deleteCategory = async (id: string): Promise<boolean> => {
    const supabase = createClient();
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) return false;
    setCategories((prev) => prev.filter((c) => c.id !== id));
    return true;
  };

  return {
    categories,
    loading,
    createCategory,
    updateCategory,
    deleteCategory,
    refetch: fetchCategories,
  };
}
