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
import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { pxToRem } from 'src/theme/typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useStores } from '../../../../../../models/root-store/root-store-context';
import { useTheme } from '@mui/material';
import { useAuthContext } from 'src/auth/useAuthContext';
import { PATH_ROOT } from '../../../../../../routes/paths';
/**
 * ## DeliveryInfoItems 설명
 *
 */
const useStyles = makeStyles(() => ({
  accordion: {
    '&.MuiAccordion-root.Mui-expanded': {
      mt: 0,
      margin:0,
      boxShadow: 'none',
    },
    overflowX: 'hidden',
    background: '#FFFFFF',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    justifyContent: 'center',
    '&.MuiAccordion-root.Mui-expanded:before': {
      opacity: 1,
    },
  },
  deliveryInfo: {
    '& .MuiAccordionSummary-content': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  },
}));
export const DeliveryInfoItems = observer(() => {
  const rootStore = useStores();
  const { loadingStore, orderHistoryStore } = rootStore;
  const theme = useTheme();
  const classes = useStyles();
  const { user, isAuthenticated } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleClickAccdn = () => {
    setOpen(!open);
    // console.log(open);
  };

  // useEffect(() =>{
  //   console.log('open : ',open);
  // },[open])

  return (
    <>
      {
        orderHistoryStore.orderHistory?.dlivryYn ? (
          <>
            <Accordion className={classes.accordion}>
              {open == false ? (
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: theme.palette.action.disabled }} />}
                  sx={{ mx: pxToRem(20), px: 0 }}
                  className={classes.deliveryInfo}
                  onClick={handleClickAccdn}
                >
                  <Typography variant={'Kor_18_b'}>배송지 정보</Typography>
                  <Typography variant={'Kor_14_r'}>{orderHistoryStore.orderHistory?.rcipntNm} | {orderHistoryStore.orderHistory?.addr?.substring(0,15)+'..'}</Typography>
                </AccordionSummary>
              ) : (
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: theme.palette.action.disabled }} />}
                  sx={{ mx: pxToRem(20), px: 0 }}
                  className={classes.deliveryInfo}
                  onClick={handleClickAccdn}
                >
                  {' '}
                  <Typography variant={'Kor_18_b'}>배송지 정보</Typography>
                </AccordionSummary>
              )}

              <AccordionDetails sx={{ mx: pxToRem(20), p: 0, my: pxToRem(20) }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: pxToRem(12) }}>
                  <Typography
                    variant={'Kor_14_r'}
                    sx={{ color: '#5D6066', flex: '0 0 auto', width: pxToRem(88), textAlign: 'left', mr: pxToRem(16) }}
                  >
                    {' '}
                    받으시는 분
                  </Typography>
                  <Typography
                    variant={'Kor_14_r'}
                    sx={{ color: '#202123', flex: '0 0 auto', width: '100%', textAlign: 'left' }}
                  >
                    {orderHistoryStore.orderHistory?.rcipntNm}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: pxToRem(12) }}>
                  <Typography
                    variant={'Kor_14_r'}
                    sx={{ color: '#5D6066', flex: '0 0 auto', width: pxToRem(88), textAlign: 'left', mr: pxToRem(16) }}
                  >
                    {' '}
                    연락처
                  </Typography>
                  <Typography
                    variant={'Kor_14_r'}
                    sx={{ color: '#202123', flex: '0 0 auto', width: '100%', textAlign: 'left' }}
                  >
                    {orderHistoryStore.orderHistory?.phoneNo}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: pxToRem(12) }}>
                  <Typography
                    variant={'Kor_14_r'}
                    sx={{ color: '#5D6066', flex: '0 0 auto', width: pxToRem(88), textAlign: 'left', mr: pxToRem(16) }}
                  >
                    {' '}
                    배송지
                  </Typography>
                  <Typography
                    variant={'Kor_14_r'}
                    sx={{ color: '#202123', width: '100%', textAlign: 'left' }}
                  >
                    ({orderHistoryStore.orderHistory?.zoneCd}) {orderHistoryStore.orderHistory?.addr}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: pxToRem(28) }}>
                  <Typography
                    variant={'Kor_14_r'}
                    sx={{ color: '#5D6066', flex: '0 0 auto', width: pxToRem(88), textAlign: 'left', mr: pxToRem(16) }}
                  >
                    {' '}
                    배송 메세지
                  </Typography>
                  <Typography variant={'Kor_14_r'} sx={{ color: '#202123' }}>
                    {orderHistoryStore.orderHistory?.dlivryReqMemo}
                  </Typography>
                </Box>

                {isOpen === true ? (
                  <Box onClick={handleClick}>
                    <Typography variant={'Kor_12_r'} sx={{ color: '#9DA0A5', mb: pxToRem(16),  cursor:'pointer'  }}>
                      배송지 정보 유의사항-
                    </Typography>
                    <List
                      sx={{
                        listStyleType: 'disc',
                        pl: '1.25rem',
                        color: '#9DA0A5',
                        fontSize: pxToRem(12),
                      }}
                    >
                      <ListItem sx={{ display: 'list-item', p: 0, mb: '0.5rem' }}>
                        <Typography variant={'Kor_12_r'}>
                          본 검사 결과지는 검사 대상자 본인에게만 제공되며, 본인 외의 자가 결과지에 포함된
                          정보의 전부 또는 일부를 제3자에게 공개, 배포, 복사하는 등의 행위를 엄격히
                          금지하고 있습니다.
                        </Typography>
                      </ListItem>
                    </List>
                  </Box>
                ) : (
                  <Box onClick={handleClick}>
                    <Typography variant={'Kor_12_r'} sx={{ color: '#9DA0A5', mb: pxToRem(16), cursor:'pointer' }}>
                      배송지 정보 유의사항+
                    </Typography>
                  </Box>
                )}
              </AccordionDetails>
            </Accordion>
            <Divider sx={{ borderWidth: pxToRem(4) }}></Divider>
          </>
        ) : ''
      }
    </>
  );
});

export default DeliveryInfoItems;
