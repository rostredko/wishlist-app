import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider, CircularProgress } from '@mui/material';
import { darkTheme } from './theme';

const HomePage = lazy(() => import('@components/HomePage'));

const WishListItemList = lazy(() =>
  import('@components/WishListItemList').then((m) => ({ default: m.WishListItemList }))
);

import LoginControls from '@components/LoginControls';

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Box component="main" sx={{ flexGrow: 1 }}>
            <Suspense
              fallback={
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              }
            >
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/wishlist/:wishlistId" element={<WishListItemList />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </Box>

          <LoginControls />
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;