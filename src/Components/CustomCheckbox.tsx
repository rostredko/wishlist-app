import {Checkbox} from '@mui/material';
import {styled} from '@mui/material/styles';

const CustomCheckbox = styled(Checkbox)(() => ({
  paddingRight: '15px',
  '& svg': {
    fontSize: '2.5rem',
  },
  color: '#bbb',
  transition: 'color 0.2s ease',
  '&:hover': {
    color: '#888',
  },
  '&.Mui-checked': {
    color: '#4caf50',
  },
}));

export default CustomCheckbox;