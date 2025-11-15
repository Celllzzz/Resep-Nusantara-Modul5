// src/pages/ProfilePage.jsx
import { useState, useEffect, useCallback } from 'react';
// Hapus 'User' dari lucide-react, kita akan pakai dari AvatarEditor
import { Loader, Heart, AlertCircle } from 'lucide-react';
import userService from '../services/userService';
import recipeService from '../services/recipeService';
import FavoriteRecipeGrid from '../components/profile/FavoriteRecipeGrid';

// --- (MODIFIKASI) Impor komponen baru ---
import AvatarEditor from '../components/profile/AvatarEditor';
import UsernameEditor from '../components/profile/UsernameEditor';

/**
 * Komponen placeholder untuk loading profile
 */
const ProfileLoadingSkeleton = () => (
  // ... (biarkan kode skeleton apa adanya)
  <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-white/40 mb-8 animate-pulse">
    <div className="flex items-center gap-6">
      <div className="w-24 h-24 md:w-32 md:h-32 bg-slate-200 rounded-full flex-shrink-0"></div>
      <div className="flex-1 space-y-3">
        <div className="h-8 bg-slate-200 rounded-md w-1/2"></div>
        <div className="h-4 bg-slate-200 rounded-md w-3/4"></div>
        <div className="h-4 bg-slate-200 rounded-md w-1/3"></div>
      </div>
    </div>
  </div>
);

/**
 * Halaman Profil Pengguna
 * Menampilkan info pengguna dan resep favorit dari localStorage
 */
export default function ProfilePage({ onRecipeClick }) {
  const [profile, setProfile] = useState(null);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fungsi untuk memuat ID favorit dari localStorage,
   * lalu mengambil data lengkap setiap resep dari API.
   */
  const loadFavorites = useCallback(async () => {
    // ... (biarkan fungsi loadFavorites apa adanya)
    setLoading(true);
    setError(null);
    try {
      const favoriteIds = JSON.parse(localStorage.getItem('favorites') || '[]');
      if (favoriteIds.length === 0) {
        setFavoriteRecipes([]);
        setLoading(false);
        return;
      }
      const fetchPromises = favoriteIds.map(id => 
        recipeService.getRecipeById(id)
      );
      const results = await Promise.allSettled(fetchPromises);
      const fullRecipes = results
        .filter(result => result.status === 'fulfilled' && result.value.success)
        .map(result => result.value.data);
      setFavoriteRecipes(fullRecipes);
    } catch (err) {
      console.error("Gagal memuat resep favorit:", err);
      setError(err.message || "Gagal memuat data resep favorit.");
    } finally {
      setLoading(false);
    }
  }, []);

  // --- (MODIFIKASI) Buat fungsi untuk me-refresh profile ---
  const refreshProfile = () => {
    const userProfile = userService.getUserProfile();
    setProfile(userProfile);
  };

  // Efek untuk memuat profil dan favorit saat halaman dibuka
  useEffect(() => {
    // --- (MODIFIKASI) Gunakan fungsi refreshProfile ---
    refreshProfile();

    // Muat resep favorit
    loadFavorites();

    // ... (sisa event listener biarkan apa adanya)
    window.addEventListener('favoritesChanged', loadFavorites);
    return () => {
      window.removeEventListener('favoritesChanged', loadFavorites);
    };
  }, [loadFavorites]);

  /**
   * Merender konten bagian favorit berdasarkan status (loading, error, atau sukses)
   */
  const renderFavoriteContent = () => {
    // ... (biarkan fungsi renderFavoriteContent apa adanya)
    if (loading) {
      return (
        <div className="text-center py-16">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Memuat resep favorit...</p>
        </div>
      );
    }
    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-700">Gagal Memuat Favorit</h3>
          <p className="text-red-600 mt-2 mb-4">{error}</p>
          <button
            onClick={loadFavorites}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Coba Lagi
          </button>
        </div>
      );
    }
    return <FavoriteRecipeGrid recipes={favoriteRecipes} onRecipeClick={onRecipeClick} />;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 pb-20 md:pb-8">
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        
        {/* Profile Header */}
        {!profile ? (
          <ProfileLoadingSkeleton />
        ) : (
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-white/40 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              
              {/* --- (MODIFIKASI) Ganti tampilan avatar --- */}
              <AvatarEditor 
                avatar={profile.avatar} 
                onSave={refreshProfile} 
              />
              
              <div className="text-center md:text-left">
                
                {/* --- (MODIFIKASI) Ganti tampilan username --- */}
                <UsernameEditor 
                  username={profile.username}
                  onSave={refreshProfile}
                />
                
                {/* Tampilan Bio dan ID tetap sama */}
                <p className="text-slate-600 text-lg mb-2">
                  {profile.bio || "Pengguna Resep Nusantara"}
                </p>
                <p className="text-sm text-slate-400">
                  ID: {profile.userId}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Favorite Recipes Section */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6 flex items-center gap-3">
            <Heart className="w-8 h-8 text-red-500" />
            Resep Favorit Saya
          </h2>
          {renderFavoriteContent()}
        </div>

      </main>
    </div>
  );
}