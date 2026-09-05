import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from './index';

/** Pre-typed react-redux hooks — use these instead of the bare ones. */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
