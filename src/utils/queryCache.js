// src/utils/queryCache.js

/**
 * Simple in-memory query cache
 * Stores results from API calls to avoid re-fetching
 */

const cache = new Map();

// Waktu hidup default cache: 5 menit
const DEFAULT_TTL = 5 * 60 * 1000; 

/**
 * Mendapatkan data dari cache
 * @param {string} key - Kunci unik untuk query
 * @returns {Object|null} Data dari cache atau null jika tidak ada/kadaluwarsa
 */
const get = (key) => {
  const entry = cache.get(key);
  if (!entry) {
    return null;
  }

  const isExpired = Date.now() - entry.timestamp > entry.ttl;

  if (isExpired) {
    cache.delete(key); // Hapus entri yang kadaluwarsa
    return null;
  }

  return entry.data;
};

/**
 * Menyimpan data ke cache
 * @param {string} key - Kunci unik untuk query
 * @param {Object} data - Data yang akan di-cache
 * @param {number} [ttl=DEFAULT_TTL] - Waktu hidup (Time-to-live) dalam milidetik
 */
const set = (key, data, ttl = DEFAULT_TTL) => {
  const entry = {
    data,
    timestamp: Date.now(),
    ttl,
  };
  cache.set(key, entry);
};

/**
 * Menghapus (invalidate) entri spesifik dari cache
 * @param {string} key - Kunci yang akan dihapus
 */
const invalidate = (key) => {
  cache.delete(key);
};

/**
 * Menghapus semua cache yang diawali dengan prefix tertentu
 * @param {string} prefix - Prefix untuk dicocokkan
 */
const invalidatePrefix = (prefix) => {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) {
      cache.delete(key);
    }
  }
};

/**
 * Menghapus semua cache list (untuk useRecipes)
 * Kunci list kita adalah JSON string, jadi kita cari yang berawalan '{'
 */
const invalidateListCaches = () => {
  invalidatePrefix('{');
};

/**
 * Bersihkan seluruh cache
 */
const clear = () => {
  cache.clear();
};

export const queryCache = {
  get,
  set,
  invalidate,
  invalidatePrefix,
  invalidateListCaches,
  clear,
};