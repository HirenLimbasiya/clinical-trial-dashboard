/**
 * Custom Redux Hooks
 * Pre-typed hooks for better TypeScript support and consistent usage
 */

import { useDispatch, useSelector } from "react-redux";

/**
 * Use throughout your app instead of plain `useDispatch` and `useSelector`
 * These hooks have the correct types for the store
 */
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
