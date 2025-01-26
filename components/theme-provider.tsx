'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes';

export const ThemeProvider = ({ children, ...props }: ThemeProviderProps): React.ReactNode => {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
};
