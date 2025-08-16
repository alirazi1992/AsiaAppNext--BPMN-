'use client';
import React from 'react';
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from '@/app/hooks/useStore';
import CartableSearch from './cartableSearch';

const CartableComponent = () => {
  const themeMode = useStore(themeStore, (state) => state)
  return (
    <CartableSearch />
  )
}

export default CartableComponent; 