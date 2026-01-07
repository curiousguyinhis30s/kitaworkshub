'use client';

import { useState, useEffect, useCallback } from 'react';

type SidebarState = {
  collapsed: boolean;
  mobileOpen: boolean;
  toggle: () => void;
  collapse: () => void;
  expand: () => void;
  setMobileOpen: (open: boolean) => void;
};

export const useSidebarState = (): SidebarState => {
  const getInitialState = () => {
    if (typeof window === 'undefined') return false;
    try {
      const item = window.localStorage.getItem('sidebar-collapsed');
      return item ? JSON.parse(item) : false;
    } catch (error) {
      console.warn('Failed to read sidebar state from localStorage', error);
      return false;
    }
  };

  const [collapsed, setCollapsed] = useState<boolean>(getInitialState);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      window.localStorage.setItem('sidebar-collapsed', JSON.stringify(collapsed));
    } catch (error) {
      console.warn('Failed to write sidebar state to localStorage', error);
    }
  }, [collapsed]);

  const toggle = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);

  const collapse = useCallback(() => {
    setCollapsed(true);
  }, []);

  const expand = useCallback(() => {
    setCollapsed(false);
  }, []);

  return {
    collapsed,
    mobileOpen,
    toggle,
    collapse,
    expand,
    setMobileOpen,
  };
};
