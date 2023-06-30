import Box from '@mui/material/Box';
import {
  Stack,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  List,
  ListItem,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useEffect, useState } from 'react';
import { useStores } from '../../../../../../../models/root-store/root-store-context';
import { useTheme } from '@mui/material';
import { pxToRem } from 'src/theme/typography';
import { makeStyles } from '@material-ui/core/styles';
import { CallApiToStore } from 'src/utils/common';

/**
 * ## DeliveryFaq 설명
 *
 */

const useStyles = makeStyles(() => ({
  accordion: {
    '&.MuiAccordion-root.Mui-expanded': {
      mt: 0,
      margin: 0,
      backgroundColor: '#FAFAFA',
      boxShadow: 'none',
    },
    overflowX: 'scroll',
    background: '#FFFFFF',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    justifyContent: 'center',
    '&.MuiAccordion-root.Mui-expanded:before': {
      opacity: 1,
    },
    '&.css-hfj526-MuiPaper-root-MuiAccordion-root:last-of-type': {
      borderBottomRightRadius: 0,
      borderBottomLeftRadius: 0,
    },
  },
}));
export const DeliveryFaq = observer(() => {
  const rootStore = useStores();
  const { faqStore, loadingStore } = rootStore;
  const theme = useTheme();
  const [open, setOpen] = useState<boolean>(true);
  const classes = useStyles();

  const handleChange = (event: React.SyntheticEvent) => {
    setOpen(!open);
  };

  useEffect(() => {
    CallApiToStore(faqStore.getDeliveryTrackingFaq(), 'api', loadingStore)
      .then(() => {})
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <>
      <Stack>
        <Divider sx={{ borderWidth: 6 }} />
        <Typography variant={'Kor_18_b'} sx={{ textAlign: 'left', m: pxToRem(20) }}>
          배송 관련 FAQ
        </Typography>

        {faqStore.deliveryTrackingFaqs.map((faq: any, index: number) => {
          return (
            <Box key={index}>
              <Accordion key={index} className={classes.accordion}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: theme.palette.action.disabled }} />}
                  sx={{
                    mx: 0,
                    px: 3,
                    width: '100%',
                    backgroundColor: 'white',
                    borderBottom: '1px solid #EEEEEE',
                  }}
                >
                  <Stack sx={{ display: 'flex', textAlign: 'left' }}>
                    <Typography variant={'Kor_14_b'}>{faq.faqNm}</Typography>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails sx={{ p: '0 !important' }}>
                  <List
                    sx={{
                      // listStyleType: 'number',
                      py: 3,
                      px: 3,
                    }}
                  >
                    <ListItem
                      sx={{
                        display: 'list-item',
                        p: 0,
                        fontSize: '0.85rem',
                        // whiteSpace: 'pre-line',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {faq.faqConts}
                    </ListItem>
                  </List>
                </AccordionDetails>
              </Accordion>
              {index == faq.length - 1 ? <Divider sx={{ borderWidth: 6 }} /> : null}
            </Box>
          );
        })}
      </Stack>
    </>
  );
});

export default DeliveryFaq;
