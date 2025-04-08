import React, { useContext } from 'react';
import ThemeContext from '@/contexts/ThemeContext';

const ThemedButton: React.FC = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      style={{
        background: theme === 'light' ? '#fff' : '#333',
        color: theme === 'light' ? '#333' : '#fff',
      }}
    >
      Toggle Theme
    </button>
  );
};

export default ThemedButton;