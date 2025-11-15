// src/components/profile/UsernameEditor.jsx
import { useState } from 'react';
import { Edit, Check, X, Loader } from 'lucide-react';
import userService from '../../services/userService';

export default function UsernameEditor({ username, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(username);
  const [loading, setLoading] = useState(false);

  const handleEdit = () => {
    setNewUsername(username);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewUsername(username); // Reset ke username lama
  };

  const handleSave = () => {
    if (!newUsername.trim() || newUsername.trim() === username) {
      setIsEditing(false);
      return;
    }

    setLoading(true);
    const result = userService.updateUsername(newUsername);
    
    if (result.success) {
      if (onSave) {
        onSave(result.data); // Panggil callback untuk refresh
      }
    } else {
      alert('Gagal menyimpan username');
      setNewUsername(username); // Kembalikan ke username lama jika gagal
    }
    
    setLoading(false);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          className="text-3xl md:text-4xl font-bold text-slate-800 bg-white border border-blue-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
        <button
          onClick={handleSave}
          disabled={loading}
          className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors"
        >
          {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
        </button>
        <button
          onClick={handleCancel}
          disabled={loading}
          className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 group">
      <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
        {username}
      </h1>
      <button
        onClick={handleEdit}
        className="text-slate-400 hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100"
      >
        <Edit className="w-6 h-6" />
      </button>
    </div>
  );
}