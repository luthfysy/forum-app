// src/components/RichTextEditor.jsx
import React from 'react';
import PropTypes from 'prop-types';

// eslint-disable-next-line no-unused-vars
function RichTextEditor({ value, onChange, placeholder }) {
  const handleInput = (event) => {
    onChange(event.target.innerHTML);
  };

  return (
    <div
      contentEditable
      onInput={handleInput}
      placeholder={placeholder}
      style={{
        border: '1px solid #ccc',
        minHeight: '150px',
        padding: '10px',
        borderRadius: '4px',
        backgroundColor: '#fff',
        overflowY: 'auto',
        direction: 'ltr', // Pastikan arah teks dari kiri ke kanan
        unicodeBidi: 'plaintext', // Membantu dengan teks dua arah kompleks
        textAlign: 'left',
      }}
    />
  );
}

RichTextEditor.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

RichTextEditor.defaultProps = {
  placeholder: '',
};

export default RichTextEditor;
