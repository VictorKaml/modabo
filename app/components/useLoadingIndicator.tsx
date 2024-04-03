// useLoadingIndicator.js
import { useState } from 'react';

const useLoadingIndicator = () => {
  const [loading, setLoading] = useState(false);

  const showLoading = () => {
    setLoading(true);
  };

  const hideLoading = () => {
    setLoading(false);
  };

  return {
    loading,
    showLoading,
    hideLoading,
  };
};

export default useLoadingIndicator;