import { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api';

/** Busca avisos e controla carregamento e erro. */
export function useNotices() {
  const [notices, setNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setNotices(await api.list('posts?_limit=10'));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { notices, isLoading, error, reload: load };
}
