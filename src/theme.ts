import { createTheme } from "@mui/material/styles";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#2196f3",
    },
    background: {
      default: "#1c1c1c",
      paper: "#282828",
    },
  },
  typography: {
    fontFamily: 'Inter, Roboto, sans-serif',
    h3: {
      fontWeight: 500,
      fontSize: '2.5rem',
    },
  }
});