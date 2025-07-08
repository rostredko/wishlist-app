import { useEffect, useState } from "react";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import type { WishListItem } from '../types/WishListItem';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Checkbox,
  Link as MuiLink,
  Paper,
} from "@mui/material";

export function WishListItemList() {
  const [items, setItems] = useState<WishListItem[]>([]);

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
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h3" gutterBottom>
        Мой Wishlist
      </Typography>
      <Typography variant="h5" gutterBottom>
        🎁 Gift Ideas
      </Typography>
      <List>
        {items.map((item) => (
          <Paper key={item.id} sx={{ mb: 2, p: 2 }}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleClaim(item.id)}
                disabled={item.claimed}
              >
                <Checkbox checked={item.claimed} disabled />
                <ListItemText
                  primary={
                    <Typography
                      variant="h6"
                      sx={{
                        textDecoration: item.claimed ? 'line-through' : 'none',
                        color: item.claimed ? 'gray' : 'inherit',
                      }}
                    >
                      {item.name} {item.claimed && "✅ (already taken)"}
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
                            underline="always"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Link
                          </MuiLink>
                          <br />
                        </>
                      )}

                      {item.description && (
                        <Typography variant="body2" color="textSecondary" component="span">
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
  );
}