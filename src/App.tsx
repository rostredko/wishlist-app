import { WishListItemList } from './Components/WishListItemList.tsx';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { darkTheme } from './theme.ts';

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <WishListItemList/>
    </ThemeProvider>
  );
}

export default App;