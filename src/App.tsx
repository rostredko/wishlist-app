import { WishListItemList } from './Components/WishListItemList.tsx';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { darkTheme } from './theme.ts';
import LoginControls from './Components/LoginControls.tsx';

function App() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box sx={{ flexGrow: 1 }}>
          <WishListItemList />
        </Box>
        <LoginControls />
      </ThemeProvider>
    </Box>
  );
}

export default App;