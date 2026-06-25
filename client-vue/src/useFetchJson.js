import { ref, watchEffect } from 'vue';
import { fetchJson } from './api';

// Shared data-fetching composable: loads JSON from the given API URL once on mount,
// exposing the same loading/error/data states each page needs.
export function useFetchJson(url) {
    const data = ref(null);
    const error = ref(null);

    watchEffect((onCleanup) => {
        let cancelled = false;
        onCleanup(() => {
            cancelled = true;
        });

        fetchJson(url)
            .then((result) => {
                if (!cancelled) data.value = result;
            })
            .catch((err) => {
                console.error(err);
                if (!cancelled) error.value = err;
            });
    });

    return { data, error };
}
