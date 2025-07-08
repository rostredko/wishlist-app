import { Checkbox } from '@mui/material';
import { styled } from '@mui/material/styles';

const CustomCheckbox = styled(Checkbox)(({ theme }) => ({
  paddingRight: '15px',
  '& svg': {
    fontSize: '2.5rem',
  },
  color: '#bbb',
  '&.Mui-checked': {
    color: '#4caf50',
  },
}));

export { CustomCheckbox };