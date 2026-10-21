import { memo, useState } from 'react';
import type { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';

import type { WishListItem } from '@models/WishListItem';
import CustomCheckbox from '@components/CustomCheckbox';

import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import type { MenuProps } from '@mui/material/Menu';
import {
  Box,
  Typography,
  ListItem,
  ListItemText,
  ListItemButton,
  Link as MuiLink,
  Paper,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon as MuiListItemIcon,
} from '@mui/material';

import { trackGiftLinkClick } from '@utils/giftLinkTracking';
import { formatPrice, isValidMoney } from '@utils/money';

export type WishListItemRowProps = {
  item: WishListItem;
  canEdit: boolean;
  isDemo?: boolean;
  onRowClick: () => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
};

export const WishListItemRow = memo(function WishListItemRow({
  item,
  canEdit,
  isDemo = false,
  onRowClick,
  onEditClick,
  onDeleteClick,
}: WishListItemRowProps) {
  const { t, i18n } = useTranslation('wishlist');
  const isLockedForGuest = !canEdit && item.claimed;

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuAnchor);
  const openMenu = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
  };
  const settleCloseMenu = (event?: unknown) => {
    if (event && typeof event === 'object' && 'stopPropagation' in event) {
      (event as MouseEvent).stopPropagation();
    }
    setMenuAnchor(null);
  };

  const closeMenu: MenuProps['onClose'] = (event) => {
    settleCloseMenu(event);
  };

  const handleGiftClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
    if (item.link) trackGiftLinkClick(canEdit ? 'owner' : 'guest', isDemo);
  };

  return (
    <Paper
      sx={{
        mb: 1.5,
        p: { xs: 1, sm: 1.5 },
        borderRadius: 3,
        border: '1px solid #2c2c2c',
        boxShadow: 'none',
        transition: 'background-color 0.2s ease, transform 0.2s ease',
        '&:hover': { backgroundColor: '#2a2a2a', transform: 'scale(1.02)' },
      }}
    >
      <ListItem alignItems="flex-start" sx={{ py: { xs: 0.5, sm: 0.75 } }}>
        <ListItemButton
          aria-disabled={isLockedForGuest}
          onClick={onRowClick}
          sx={{
            borderRadius: '15px',
            ...(isLockedForGuest ? { opacity: 0.6 } : {}),
            '&:hover': { backgroundColor: '#3d3d3d' },
            width: '100%',
            px: { xs: 1, sm: 1.5 },
            py: { xs: 1, sm: 1 },
            alignItems: 'stretch',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1, sm: 2 },
              flexGrow: 1,
              minWidth: 0,
            }}
          >
            <Box sx={{ flex: '0 0 auto', display: 'flex', alignItems: 'center' }}>
              <CustomCheckbox
                checked={item.claimed}
                disabled
                icon={<RadioButtonUncheckedIcon fontSize="small" />}
                checkedIcon={<CheckCircleIcon fontSize="small" />}
              />
            </Box>

            <ListItemText
              sx={{ minWidth: 0, flex: '1 1 auto', my: 0 }}
              primary={
                <Typography
                  variant="h6"
                  sx={{
                    textDecoration: item.claimed ? 'line-through' : 'none',
                    color: item.claimed ? 'gray' : 'inherit',
                    wordBreak: 'break-word',
                    overflowWrap: 'anywhere',
                  }}
                >
                  {item.name}
                </Typography>
              }
              secondary={
                <>
                  {isValidMoney(item.priceMinor, item.currency) && (
                    <Typography component="span" variant="body2" sx={{ display: 'block', mb: 0.5 }}>
                      {t('indicativePrice', { price: formatPrice(item.priceMinor!, item.currency!, i18n.language) })}
                    </Typography>
                  )}
                  {item.link ? (
                    <>
                      <MuiLink
                        href={item.link ?? undefined}
                        target="_blank"
                        rel="noopener noreferrer"
                        color="primary"
                        underline="hover"
                        onClick={handleGiftClick}
                        onAuxClick={(event) => {
                          event.stopPropagation();
                          if (event.button === 1) trackGiftLinkClick(canEdit ? 'owner' : 'guest', isDemo);
                        }}
                      >
                        {t('link')}
                      </MuiLink>
                      <br />
                    </>
                  ) : null}
                  {item.description ? (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      component="span"
                      sx={{
                        display: 'block',
                        mt: 0.25,
                        wordBreak: 'break-word',
                        overflowWrap: 'anywhere',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {item.description}
                    </Typography>
                  ) : null}
                </>
              }
            />
          </Box>

          {canEdit && (
            <>
              <Box
                sx={{
                  display: { xs: 'none', sm: 'flex' },
                  gap: 0.5,
                  ml: 1,
                  flex: '0 0 auto',
                  alignSelf: 'center',
                }}
              >
                <Tooltip title={t('editTitleTooltip')} arrow>
                  <IconButton
                    size="small"
                    aria-label={t('editAria')}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditClick();
                    }}
                  >
                    <EditIcon sx={{ fontSize: 18, color: '#bbb' }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t('deleteTitleTooltip')} arrow>
                  <IconButton
                    size="small"
                    aria-label={t('deleteAria')}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteClick();
                    }}
                  >
                    <DeleteIcon sx={{ fontSize: 18, color: '#999' }} />
                  </IconButton>
                </Tooltip>
              </Box>

              <Box sx={{ display: { xs: 'flex', sm: 'none' }, ml: 0.25, alignSelf: 'center' }}>
                <IconButton
                  size="small"
                  aria-label={t('moreActionsAria', { defaultValue: 'More actions' })}
                  onClick={openMenu}
                  sx={{ p: 1 }}
                >
                  <MoreVertIcon sx={{ fontSize: 20, color: '#aaa' }} />
                </IconButton>
                <Menu
                  anchorEl={menuAnchor}
                  open={menuOpen}
                  onClose={closeMenu}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  <MenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      settleCloseMenu(e);
                      onEditClick();
                    }}
                  >
                    <MuiListItemIcon>
                      <EditIcon fontSize="small" />
                    </MuiListItemIcon>
                    {t('editTitleTooltip')}
                  </MenuItem>
                  <MenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      settleCloseMenu(e);
                      onDeleteClick();
                    }}
                  >
                    <MuiListItemIcon>
                      <DeleteIcon fontSize="small" />
                    </MuiListItemIcon>
                    {t('deleteTitleTooltip')}
                  </MenuItem>
                </Menu>
              </Box>
            </>
          )}
        </ListItemButton>
      </ListItem>
    </Paper>
  );
});
