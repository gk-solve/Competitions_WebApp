import { useEffect, useState } from 'react';
import { fetchJson } from './api';

// Shared data-fetching hook: loads JSON from the given API URL once on mount,
// exposing the same loading/error/data states each page needs.
export function useFetchJson(url) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        fetchJson(url)
            .then((result) => {
                if (!cancelled) setData(result);
            })
            .catch((err) => {
                console.error(err);
                if (!cancelled) setError(err);
            });

        return () => {
            cancelled = true;
        };
    }, [url]);

    return { data, error };
}
