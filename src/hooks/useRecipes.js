// src/hooks/useRecipes.js
import { useState, useEffect, useCallback } from 'react';
import recipeService from '../services/recipeService';
import { queryCache } from '../utils/queryCache'; // <-- IMPORT CACHE

/**
 * Custom hook for fetching recipes
 * @param {Object} params - Query parameters
 * @returns {Object} - { recipes, loading, error, pagination, refetch }
 */
export function useRecipes(params = {}) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const paramsKey = JSON.stringify(params); // <-- Kunci stabil untuk cache

  const fetchRecipes = useCallback(async () => {
    const cacheKey = paramsKey;
    const cachedEntry = queryCache.get(cacheKey); // <-- CEK CACHE

    if (cachedEntry) {
      setRecipes(cachedEntry.data || []);
      setPagination(cachedEntry.pagination || null);
      setLoading(false);
      setError(null);
      return; // Data ditemukan di cache
    }

    // Jika tidak ada di cache, lakukan fetch
    try {
      setLoading(true);
      setError(null);
      const response = await recipeService.getRecipes(params);
      
      if (response.success) {
        const data = response.data || [];
        const pagination = response.pagination || null;
        setRecipes(data);
        setPagination(pagination);
        
        // <-- SIMPAN KE CACHE
        queryCache.set(cacheKey, { data, pagination }); 
      } else {
        setError(response.message || 'Failed to fetch recipes');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching recipes');
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }, [paramsKey]); // <-- Gunakan paramsKey sebagai dependency

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  return {
    recipes,
    loading,
    error,
    pagination,
    refetch: fetchRecipes,
  };
}

/**
 * Custom hook for fetching a single recipe
 * @param {string} id - Recipe ID
 * @returns {Object} - { recipe, loading, error, refetch }
 */
export function useRecipe(id) {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecipe = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    const cacheKey = `recipe_${id}`; // <-- Kunci unik untuk resep
    const cachedEntry = queryCache.get(cacheKey); // <-- CEK CACHE

    if (cachedEntry) {
      setRecipe(cachedEntry.data);
      setLoading(false);
      setError(null);
      return; // Data ditemukan di cache
    }

    try {
      setLoading(true);
      setError(null);
      const response = await recipeService.getRecipeById(id);
      
      if (response.success) {
        setRecipe(response.data);
        // <-- SIMPAN KE CACHE
        queryCache.set(cacheKey, { data: response.data });
      } else {
        setError(response.message || 'Failed to fetch recipe');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching recipe');
      setRecipe(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRecipe();
  }, [fetchRecipe]);

  return {
    recipe,
    loading,
    error,
    refetch: fetchRecipe,
  };
}