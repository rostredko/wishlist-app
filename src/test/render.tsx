import type {ReactNode} from 'react';
import {render} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';

function Providers({children}: { children: ReactNode }) {
  return <BrowserRouter>{children}</BrowserRouter>;
}

export const customRender = (ui: React.ReactElement, options?: any) =>
  render(ui, {wrapper: Providers as any, ...options});

export * from '@testing-library/react';