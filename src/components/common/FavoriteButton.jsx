// src/components/common/FavoriteButton.jsx
import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

/**
 * FavoriteButton Component
 * Menggunakan localStorage untuk menyimpan dan mengambil data favorit
 */
export default function FavoriteButton({ recipeId, size = 'md' }) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Size variants
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  // Periksa status favorit dari localStorage saat komponen dimuat
  useEffect(() => {
    try {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setIsFavorited(favorites.includes(recipeId));
    } catch (error) {
      console.error("Gagal memuat favorit dari localStorage:", error);
      setIsFavorited(false);
    }
  }, [recipeId]);

  const handleToggle = (e) => {
    e.stopPropagation(); // Mencegah klik pada card
    
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    // Toggle di localStorage
    let newFavoritedState;
    try {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      const index = favorites.indexOf(recipeId);
      
      if (index > -1) {
        // Hapus dari favorit
        favorites.splice(index, 1);
        newFavoritedState = false;
      } else {
        // Tambah ke favorit
        favorites.push(recipeId);
        newFavoritedState = true;
      }
      
      localStorage.setItem('favorites', JSON.stringify(favorites));
      setIsFavorited(newFavoritedState);

      // KIRIM SINYAL GLOBAL BAHWA FAVORIT TELAH BERUBAH
      window.dispatchEvent(new CustomEvent('favoritesChanged'));

    } catch (error) {
      console.error("Gagal menyimpan favorit ke localStorage:", error);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        ${sizes[size]} rounded-full flex items-center justify-center gap-1.5
        transition-all duration-200 
        ${isFavorited 
          ? 'bg-red-500 hover:bg-red-600 text-white' 
          : 'bg-white/90 hover:bg-white text-slate-700 hover:text-red-500'
        }
        backdrop-blur-sm shadow-md hover:shadow-lg
        ${isAnimating ? 'scale-125' : 'scale-100'}
        group
      `}
      title={isFavorited ? 'Hapus dari favorit' : 'Tambah ke favorit'}
    >
      <Heart 
        className={`
          ${iconSizes[size]} 
          transition-all duration-200
          ${isFavorited ? 'fill-current' : ''}
          ${isAnimating ? 'animate-pulse' : ''}
        `} 
      />
    </button>
  );
}