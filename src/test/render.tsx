import type { ReactNode } from 'react';
/* eslint-disable react-refresh/only-export-components */
import { render, type RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

function Providers({ children }: { children: ReactNode }) {
  return <BrowserRouter>{children}</BrowserRouter>;
}

export const customRender = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: Providers, ...options });

export * from '@testing-library/react';