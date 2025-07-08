import { useEffect, useState } from "react";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import type { WishListItem } from '../types/WishListItem';
import { CustomCheckbox } from './CustomCheckbox'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Link as MuiLink,
  Paper,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
} from "@mui/material";

export function WishListItemList() {
  const [items, setItems] = useState<WishListItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<WishListItem | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleClaim = async (id: string) => {
    try {
      const itemRef = doc(db, "items", id);
      await updateDoc(itemRef, {claimed: true} as Partial<WishListItem>);
      console.log(`✅ Claimed item: ${id}`);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "items"), (snapshot) => {
      const result: WishListItem[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as WishListItem[];

      setItems(result);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <Container maxWidth="sm" sx={{ mt: 6 }}>
        <Typography variant="h2" gutterBottom>
          Мій Wishlist
        </Typography>
        <Typography variant="h3" gutterBottom sx={{ mt: 4 }}>
          🎁 Gift Ideas
        </Typography>
        <List>
          {items.map((item) => (
            <Paper key={item.id}
                   sx={{
                     mb: 2,
                     p: 1,
                     borderRadius: 3,
                     border: '1px solid #2c2c2c',
                     boxShadow: 'none',
                     transition: 'background-color 0.2s ease, transform 0.2s ease',
                     '&:hover': {
                       backgroundColor: '#2a2a2a',
                       transform: 'scale(1.02)',
                     },
                   }}
            >
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    if (!item.claimed) {
                      setSelectedItem(item);
                      setConfirmOpen(true);
                    }
                  }}
                  disabled={item.claimed}
                  sx={{
                    borderRadius: '15px',
                      '&:hover': {
                        backgroundColor: '#3d3d3d'
                      }
                  }}
                >
                  <CustomCheckbox
                    checked={item.claimed}
                    disabled
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<CheckCircleIcon />}
                  />
                  <ListItemText
                    primary={
                      <Typography
                        variant="h6"
                        sx={{
                          textDecoration: item.claimed ? 'line-through' : 'none',
                          color: item.claimed ? 'gray' : 'inherit',
                        }}
                      >
                        {item.name}
                      </Typography>
                    }
                    secondary={
                      <>
                        {item.link && (
                          <>
                            <MuiLink
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              color="primary"
                              underline="hover"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Link
                            </MuiLink>
                            <br />
                          </>
                        )}

                        {item.description && (
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            component="span"
                          >
                            {item.description}
                          </Typography>
                        )}
                      </>
                    }
                  />
                </ListItemButton>
              </ListItem>
            </Paper>
          ))}
        </List>
      </Container>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
      >
        <DialogTitle>
          {`Confirm to take "${selectedItem?.name}"?`}
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>No</Button>
          <Button
            onClick={() => {
              if (selectedItem) {
                handleClaim(selectedItem.id);
              }
              setConfirmOpen(false);
            }}
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}