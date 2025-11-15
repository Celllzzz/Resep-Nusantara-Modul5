// src/main.jsx
import { StrictMode, useState, useEffect } from 'react'; // Impor useEffect
import { createRoot } from 'react-dom/client';
import SplashScreen from './pages/SplashScreen';
import HomePage from './pages/HomePage';
import MakananPage from './pages/MakananPage';
import MinumanPage from './pages/MinumanPage';
import ProfilePage from './pages/ProfilePage';
import CreateRecipePage from './pages/CreateRecipePage';
import EditRecipePage from './pages/EditRecipePage';
import RecipeDetail from './components/recipe/RecipeDetail';
import DesktopNavbar from './components/navbar/DesktopNavbar';
import MobileNavbar from './components/navbar/MobileNavbar';
import './index.css'
import PWABadge from './PWABadge';

function AppRoot() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [mode, setMode] = useState('list'); // 'list', 'detail', 'create', 'edit'
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('makanan');
  const [editingRecipeId, setEditingRecipeId] = useState(null);

  // === FUNGSI ROUTING DITAMBAHKAN DI SINI ===
  useEffect(() => {
    // Fungsi ini berjalan sekali saat aplikasi pertama kali dimuat
    const path = window.location.pathname;

    // 1. Cek untuk link resep: /resep/123
    if (path.startsWith('/resep/')) {
      const id = path.split('/')[2];
      if (id) {
        setSelectedRecipeId(id);
        setSelectedCategory('makanan'); // Default ke style 'makanan'
        setMode('detail');
        setCurrentPage('home'); // Tetapkan halaman dasar
      }
    } 
    // 2. Cek untuk halaman edit: /edit/123
    else if (path.startsWith('/edit/')) {
      const id = path.split('/')[2];
      if (id) {
        setEditingRecipeId(id);
        setMode('edit');
        setCurrentPage('home');
      }
    }
    // 3. Cek untuk halaman buat resep
    else if (path === '/buat') {
      setMode('create');
      setCurrentPage('home');
    }
    // 4. Cek untuk halaman utama
    else if (path === '/makanan') {
      setCurrentPage('makanan');
    } else if (path === '/minuman') {
      setCurrentPage('minuman');
    } else if (path === '/profile') {
      setCurrentPage('profile');
    }
    // 5. Default akan ke 'home' (sudah di-set di useState)

  }, []); // Array kosong berarti ini hanya berjalan sekali saat mount

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleNavigation = (page) => {
    setCurrentPage(page);
    setMode('list');
    setSelectedRecipeId(null);
    setEditingRecipeId(null);
    // Perbarui URL di browser
    window.history.pushState(null, '', `/${page === 'home' ? '' : page}`);
  };

  const handleCreateRecipe = () => {
    setMode('create');
    // Perbarui URL di browser
    window.history.pushState(null, '', '/buat');
  };

  const handleRecipeClick = (recipeId, category) => {
    setSelectedRecipeId(recipeId);
    setSelectedCategory(category || currentPage);
    setMode('detail');
    // Perbarui URL di browser
    window.history.pushState(null, '', `/resep/${recipeId}`);
  };

  const handleEditRecipe = (recipeId) => {
    console.log('🔧 Edit button clicked! Recipe ID:', recipeId);
    setEditingRecipeId(recipeId);
    setMode('edit');
    console.log('✅ Mode changed to: edit');
    // Perbarui URL di browser
    window.history.pushState(null, '', `/edit/${recipeId}`);
  };

  const handleBack = () => {
    setMode('list');
    setSelectedRecipeId(null);
    setEditingRecipeId(null);
    // Perbarui URL di browser ke halaman list sebelumnya
    window.history.pushState(null, '', `/${currentPage === 'home' ? '' : currentPage}`);
  };

  const handleCreateSuccess = (newRecipe) => {
    alert('Resep berhasil dibuat!');
    setMode('list');
    if (newRecipe && newRecipe.category) {
      setCurrentPage(newRecipe.category);
      // Perbarui URL di browser
      window.history.pushState(null, '', `/${newRecipe.category}`);
    } else {
      window.history.pushState(null, '', '/');
    }
  };

  const handleEditSuccess = (updatedRecipe) => {
    alert('Resep berhasil diperbarui!');
    setMode('list');
    // Perbarui URL di browser
    window.history.pushState(null, '', `/${currentPage === 'home' ? '' : currentPage}`);
  };

  const renderCurrentPage = () => {
    // Show Create Recipe Page
    if (mode === 'create') {
      return (
        <CreateRecipePage
          onBack={handleBack}
          onSuccess={handleCreateSuccess}
        />
      );
    }

    // Show Edit Recipe Page
    if (mode === 'edit') {
      return (
        <EditRecipePage
          recipeId={editingRecipeId}
          onBack={handleBack}
          onSuccess={handleEditSuccess}
        />
      );
    }

    // Show Recipe Detail
    if (mode === 'detail') {
      return (
        <RecipeDetail
          recipeId={selectedRecipeId}
          category={selectedCategory}
          onBack={handleBack}
          onEdit={handleEditRecipe}
        />
      );
    }

    // Show List Pages
    switch (currentPage) {
      case 'home':
        return <HomePage onRecipeClick={handleRecipeClick} onNavigate={handleNavigation} />;
      case 'makanan':
        return <MakananPage onRecipeClick={(id) => handleRecipeClick(id, 'makanan')} />;
      case 'minuman':
        return <MinumanPage onRecipeClick={(id) => handleRecipeClick(id, 'minuman')} />;
      case 'profile':
        return <ProfilePage onRecipeClick={handleRecipeClick} />; // onRecipeClick sudah bisa menangani kategori
      default:
        return <HomePage onRecipeClick={handleRecipeClick} onNavigate={handleNavigation} />;
    }
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Only show navbar in list mode */}
      {mode === 'list' && (
        <>
          <DesktopNavbar 
            currentPage={currentPage} 
            onNavigate={handleNavigation}
            onCreateRecipe={handleCreateRecipe}
          />
          <MobileNavbar 
            currentPage={currentPage} 
            onNavigate={handleNavigation}
            onCreateRecipe={handleCreateRecipe}
          />
        </>
      )}
      
      {/* Main Content */}
      <main className="min-h-screen">
        {renderCurrentPage()}
      </main>

      <PWABadge />
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRoot />
  </StrictMode>,
)