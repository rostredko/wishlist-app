import { useTranslation } from 'react-i18next';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

type RouteLang = 'ua' | 'en';

type Props = {
  lang: RouteLang;
  faqData: Array<{ q: string; a: string }> | null;
};

export function HomePageFaq({ lang, faqData }: Props) {
  const { t } = useTranslation(['home', 'examples'], { lng: lang });

  if (!faqData) return null;

  return (
    <Box sx={{ mt: 8, mb: 4 }}>
      <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 32, mb: 3, textAlign: 'center' }}>
        {t('faqTitle')}
      </Typography>
      <Box>
        {faqData.map((item, idx) => (
          <Accordion
            key={idx}
            disableGutters
            elevation={0}
            sx={{
              '&:before': { display: 'none' },
              mb: 1,
              border: '1px solid #333',
              borderRadius: '8px !important',
              overflow: 'hidden',
              bgcolor: 'transparent',
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`faq-panel${idx}-content`}
              id={`faq-panel${idx}-header`}
              sx={{ '& .MuiAccordionSummary-content': { my: 2 } }}
            >
              <Typography component="span" variant="subtitle1" sx={{ fontWeight: 600 }}>
                {item.q}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" color="text.secondary">
                {item.a}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
}
