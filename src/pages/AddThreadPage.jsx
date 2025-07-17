// src/pages/AddThreadPage.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Navigate } from 'react-router-dom';
import RichTextEditor from '../components/RichTextEditor';
import { asyncAddThread } from '../redux/actions/threadsActions';

function AddThreadPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authUser = useSelector((state) => state.auth);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [body, setBody] = useState('');

  if (!authUser) {
    return <Navigate to="/login" />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title.trim() || !body.trim()) {
      // eslint-disable-next-line no-alert
      alert('Judul dan isi thread tidak boleh kosong!');
      return;
    }
    const success = await dispatch(asyncAddThread({ title, body, category: category.trim() }));
    if (success) {
      navigate('/');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Buat Thread Baru</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input
          type="text"
          placeholder="Judul Thread"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <input
          type="text"
          placeholder="Kategori (opsional, contoh: general, frontend)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <RichTextEditor
          value={body}
          onChange={setBody}
          placeholder="Tulis isi thread Anda..."
        />
        <button
          type="submit"
          style={{
            padding: '12px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1.1em',
          }}
        >
          Buat Thread
        </button>
      </form>
    </div>
  );
}

export default AddThreadPage;
