import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { darkTheme } from './theme.ts';
import { WishListItemList } from './Components/WishListItemList.tsx';
import LoginControls from './Components/LoginControls.tsx';

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/wishlist/:wishlistId" element={<WishListItemList />} />
              <Route path="*" element={<Navigate to="/wishlist/default" replace />} />
            </Routes>
          </Box>
          <LoginControls />
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;