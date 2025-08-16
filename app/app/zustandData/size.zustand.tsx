import { useState } from 'react';
import { create } from 'zustand';

type Store = {
  innerWidth?: boolean,
  desktopSideBar: {
    left: string;
    zIndex: string;
    display: string;
    visibility: any
  };
  mobileSideBar: {
    left: string;
    transition: string;
    display: string;
    visibility: any
  };
  contentStyle: {
    width: string;
  };
  toggleMenu: () => void;
};
const useStore = create<Store>((set) => {

  const toggleMenu = () => {
    if (typeof window !== 'undefined' && window.innerWidth > 768) {
      set((state) => ({
        desktopSideBar: {
          ...state.desktopSideBar,
          left: state.desktopSideBar.left === '-180px' ? '0px' : '-180px',
          zIndex: "0",
          display: 'block',
          visibility: 'visible'
        },
        mobileSideBar: {
          ...state.mobileSideBar,
          left: state.mobileSideBar.left === '0px' ? '-70px' : '0px',
          transition: state.mobileSideBar.transition === '0s' ? '0.25s' : '0s',
          display: 'block',
          visibility: 'visible'
        },
        contentStyle: {
          ...state.contentStyle,
          width:
            state.contentStyle.width === 'calc(100% - 70px)' ? 'calc(100% - 250px)' : 'calc(100% - 70px)',
        },
      }))
    } else {
      set((state) => ({
        desktopSideBar: {
          left: '-250px',
          zIndex: "-2",
          display: 'none',
          visibility: 'hidden'
        },
        mobileSideBar: {
          ...state.mobileSideBar,
          left: '-70px',
          transition: state.mobileSideBar.transition === '0s' ? '0.25s' : '0s',
          display: 'none',
          visibility: 'hidden'
        },
        contentStyle: {
          width: '100%'
        },
      }))
    }
  };
  return {
    desktopSideBar: {
      left: '-180px',
      zIndex: "0",
      display: 'block',
      visibility: 'visible'

    },
    mobileSideBar: {
      left: '0px',
      transition: '0s',
      display: 'block',
      visibility: 'visible'
    },
    contentStyle: {
      width: 'calc(100% - 70px)',
    },
    toggleMenu,
  };
});
export default useStore; 