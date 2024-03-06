import { writable } from 'svelte/store';

function createScoreStore() {
    const { subscribe, update, set } = writable<number>(0);

    return {
        subscribe,
        reset: () => set(0),
        update: (value: number) => update(s => {
            return s + value;
        }),
    }
}

export const score = createScoreStore();