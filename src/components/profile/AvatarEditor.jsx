// src/components/profile/AvatarEditor.jsx
import { useState } from 'react';
import { User, Edit, Loader } from 'lucide-react';
import userService from '../../services/userService';

// Komponen helper untuk membaca file sebagai Base64
const toBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = (error) => reject(error);
});

export default function AvatarEditor({ avatar, onSave }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setError('');
    
    // Validasi sederhana
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Format file harus .jpg, .png, atau .webp');
      return;
    }
    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      setError('Ukuran file maksimal 2MB');
      return;
    }

    setLoading(true);
    try {
      // 1. Konversi gambar ke Base64
      const base64String = await toBase64(file);
      
      // 2. Simpan menggunakan userService
      const result = userService.updateAvatar(base64String);

      if (result.success) {
        // 3. Panggil onSave callback untuk me-refresh ProfilePage
        if (onSave) {
          onSave(result.data);
        }
      } else {
        throw new Error(result.message || 'Gagal menyimpan avatar');
      }
    } catch (err) {
      setError(err.message || 'Gagal memproses gambar');
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    document.getElementById('avatarInput').click();
  };

  return (
    <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 group">
      {/* Input file tersembunyi */}
      <input
        type="file"
        id="avatarInput"
        className="hidden"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        disabled={loading}
      />
      
      {/* Tampilan Avatar/Placeholder */}
      {avatar ? (
        <img
          src={avatar}
          alt="Avatar"
          className="w-full h-full rounded-full object-cover shadow-lg"
        />
      ) : (
        <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center border-4 border-white shadow-lg">
          <User className="w-16 h-16 text-blue-400" />
        </div>
      )}

      {/* Tombol Edit / Loading Overlay */}
      <div 
        onClick={!loading ? triggerFileInput : undefined}
        className="absolute inset-0 w-full h-full rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
      >
        {loading ? (
          <Loader className="w-8 h-8 text-white animate-spin" />
        ) : (
          <Edit className="w-8 h-8 text-white" />
        )}
      </div>

      {/* Tampilan Error */}
      {error && (
        <p className="absolute -bottom-6 text-xs text-red-600 w-full text-center">
          {error}
        </p>
      )}
    </div>
  );
}