import { Button, Container, Typography } from '@mui/material';

function App() {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        WishList App
      </Typography>
      <Button variant="contained">Test Button</Button>
    </Container>
  );
}

export default App;