import {Checkbox} from '@mui/material';
import {styled} from '@mui/material/styles';

const CustomCheckbox = styled(Checkbox)(({theme}) => ({
  padding: 5,
  margin: 5,
  color: '#bbb',
  transition: 'color 0.2s ease',
  '& svg': {
    fontSize: '2.2rem',
  },
  '&:hover': {
    color: '#888',
  },
  '&.Mui-checked': {
    color: '#4caf50',
  },

  [theme.breakpoints.down('sm')]: {
    paddingRight: 5,
    paddingLeft: 0,
    marginRight: 3,
    minWidth: 'auto',
    '& svg': {
      fontSize: '1.8rem',
    },
  },
}));

export default CustomCheckbox;