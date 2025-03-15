import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';

// 使用类型化的useSelector hook
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// 使用类型化的useDispatch hook
export const useAppDispatch = () => useDispatch<AppDispatch>(); 