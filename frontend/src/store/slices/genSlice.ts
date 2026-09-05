import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { GenState, Theme } from '@/lib/models/genModels';

/**
 * General UI state that belongs to the browser rather than the account.
 *
 * The theme starts at `system` on both sides of the render: the server cannot
 * know the visitor's preference, so anything else would mismatch on hydration.
 * `useTheme` adopts the stored preference right after — by which point the
 * pre-paint script in index.html has already painted it.
 */
const initialState: GenState = {
    theme: 'system',
};

const genSlice = createSlice({
    name: 'gen',
    initialState,
    reducers: {
        themeChanged(state, action: PayloadAction<Theme>) {
            state.theme = action.payload;
        },
    },
});

export const { themeChanged } = genSlice.actions;

export const selectTheme = (state: { gen: GenState }) => state.gen.theme;

export default genSlice.reducer;
