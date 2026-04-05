import {Checkbox} from '@mui/material';
import {styled} from '@mui/material/styles';

/** Mobile-first: compact tap target + icon on xs; default MUI spacing from sm up */
const CustomCheckbox = styled(Checkbox)(({ theme }) => ({
  paddingRight: 5,
  paddingLeft: 0,
  marginRight: 3,
  marginLeft: 0,
  minWidth: 'auto',
  color: '#bbb',
  transition: 'color 0.2s ease',
  '& svg': {
    fontSize: '1.8rem',
  },
  '&:hover': {
    color: '#888',
  },
  '&.Mui-checked': {
    color: '#4caf50',
  },
  [theme.breakpoints.up('sm')]: {
    padding: 5,
    margin: 5,
    minWidth: 'initial',
    '& svg': {
      fontSize: '2.2rem',
    },
  },
}));

export default CustomCheckbox;