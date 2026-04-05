import { createTheme } from "@mui/material/styles";

/** Base theme for breakpoint keys (mobile-first typography scales up from default / xs). */
const foundation = createTheme({
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
});

export const darkTheme = createTheme(foundation, {
  typography: {
    fontFamily: 'Inter, Roboto, sans-serif',
    h3: {
      fontWeight: 500,
      fontSize: '1.65rem',
      lineHeight: 1.25,
      [foundation.breakpoints.up('sm')]: {
        fontSize: '2rem',
      },
      [foundation.breakpoints.up('md')]: {
        fontSize: '2.5rem',
      },
    },
    h4: {
      fontSize: '1.2rem',
      lineHeight: 1.35,
      [foundation.breakpoints.up('sm')]: {
        fontSize: '1.35rem',
      },
      [foundation.breakpoints.up('md')]: {
        fontSize: '2.125rem',
      },
    },
  },
});