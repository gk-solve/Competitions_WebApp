import { Signal, signal } from '@angular/core';
import { fetchJson } from './api';

// Shared data-fetching helper: loads JSON from the given API URL once, exposing the
// same loading/error/data signals each page needs.
export function useFetchJson<T>(url: string): { data: Signal<T | null>; error: Signal<Error | null> } {
    const data = signal<T | null>(null);
    const error = signal<Error | null>(null);

    fetchJson<T>(url)
        .then((result) => data.set(result))
        .catch((err: Error) => {
            console.error(err);
            error.set(err);
        });

    return { data, error };
}
