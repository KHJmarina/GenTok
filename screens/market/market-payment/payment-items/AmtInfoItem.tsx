import { Box, Stack, Typography, Divider, styled, Tooltip, TooltipProps, tooltipClasses } from '@mui/material';
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from 'react';
import { useStores } from "src/models/root-store/root-store-context"
import { useTheme } from '@mui/material';
import ArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { IPaymentModel } from 'src/models/market-store/Payment';
import { numberComma } from 'src/utils/common';
import { pxToRem } from 'src/theme/typography';
import { ReactComponent as ListDownIcon } from 'src/assets/icons/ico-list-down.svg';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

/**
 * ## AmtInfoItem 설명
 *
 */

interface Props {
  usePoint: number;
}

export const AmtInfoItem = observer(({ usePoint }: Props) => {

  const rootStore = useStores();
  const { loadingStore, orderStore } = rootStore;
  const theme = useTheme();

  const [openPrice, setOpenPrice] = useState(false);
  const payment = orderStore.amtInfo.payment as IPaymentModel;

  const handleToggle = () => {
    setOpenPrice(!openPrice);
  };

  useEffect(() => {
    orderStore.orderItem.setProps({
      goodsAmt: payment.totGoodsAmt,
      dscntAmt: payment.totCpnDscntAmt,
      paymentAmt: payment.totPaymentAmt,
    });
  },[payment]);

  return (
    <>
      <Stack sx={{ m: pxToRem(20) }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }} justifyContent='space-between' onClick={() => {handleToggle()}}>
          <Typography variant={'Kor_18_b'}>결제금액</Typography>
          { !openPrice && 
            <Typography variant={'Eng_22_b'} sx={{ color: '#FF6F00', ml: 'auto', mr: pxToRem(14) }}>
              {numberComma(payment.totPaymentAmt - usePoint)}
              <Typography variant={'Kor_14_r'}>&nbsp;{payment.currencyCd?.value}</Typography>
            </Typography>
          }
          <Box sx={{ color: '#9DA0A5', mt: 0.5 }}> 
            {openPrice ? <ArrowUpIcon style={{ cursor: 'pointer' }}/> : <ArrowDownIcon style={{ cursor: 'pointer' }}/>}
          </Box>
        </Box>
        {openPrice && (
          <Stack>
            <Box sx={{ display: 'flex', my: pxToRem(16) }} justifyContent='space-between'>
              <Typography>총 상품금액</Typography>
              <Typography variant={'Kor_16_b'}>{numberComma(payment.totGoodsAmt)}
                <Typography variant={'Kor_14_r'}>&nbsp;{payment.currencyCd?.value}</Typography>
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', mb: pxToRem(16) }} justifyContent='space-between'>
              <Typography>쿠폰할인</Typography>
              <Typography variant={'Kor_16_b'} sx={{ color: payment.totCpnDscntAmt > 0 ? theme.palette.primary.main : '#202123'}}>
                {payment.totCpnDscntAmt != 0 && (
                  '-'
                )}
                {numberComma(payment.totCpnDscntAmt)}
                <Typography variant={'Kor_14_r'}>&nbsp;{payment.currencyCd?.value}</Typography>
              </Typography>
            </Box>
            {payment.cpnDscntList.map((cpnDscnt, index: number) => (
              <Box key={`cpnDscnt-${index}`} sx={{ display: 'flex', mb: pxToRem(16), color: '#9DA0A5' }} justifyContent='space-between'>
                <Box>
                  <ListDownIcon />
                  <Typography variant={'Kor_14_r'}>{cpnDscnt.cpnNm}</Typography>
                </Box>
                <Typography variant={'Kor_14_r'}>-{numberComma(cpnDscnt?.cpnDscntAmt || 0)} {payment.currencyCd?.value}</Typography>
              </Box>
            ))}

            {payment.autoDscntDispYn && (
              <Box sx={{ display: 'flex', mb: pxToRem(16) }} justifyContent='space-between'>
                <Typography>자동할인
                  <HtmlTooltip
                    title={
                      <React.Fragment>
                        <Typography variant='Kor_12_r'>
                          고객님의 누적 예상 금액이 {payment.stdGoodsNm} 상품가를 초과하여
                          해당 <span style={{ fontWeight: 600, color: theme.palette.primary.main}}> 차액에 대한 자동 할인</span>을 제공합니다.<br/>
                          <Stack>
                            <Box>
                              <ListDownIcon /> 
                              누적 예상 금액: {numberComma(payment.accumPaymentAmt+(payment.stdGoodsAmt || 0))}{payment.currencyCd?.value} (키트비 제외)
                            </Box>
                            <Box>
                              <ListDownIcon />
                              {payment.stdGoodsAmt != null && (
                                `${payment.stdGoodsNm} 상품가: ${numberComma(payment.stdGoodsAmt)}${payment.currencyCd?.value}`
                              )}
                            </Box>
                          </Stack>
                        </Typography>
                      </React.Fragment>
                    }
                  >
                    <HelpOutlineIcon
                      style={{
                        verticalAlign: 'middle',
                        color: '#9DA0A5',
                        width: pxToRem(20),
                        height: pxToRem(20),
                        marginLeft: pxToRem(5.76)
                      }}
                    />
                  </HtmlTooltip>
                </Typography>
                <Typography variant={'Kor_16_b'} sx={{ color: payment.totAutoDscntAmt > 0 ? theme.palette.primary.main : '#202123'}}>
                  {payment.totAutoDscntAmt != 0 && (
                    '-'
                  )}
                  {numberComma(payment.totAutoDscntAmt)}
                  <Typography variant={'Kor_14_r'}>&nbsp;{payment.currencyCd?.value}</Typography>
                </Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', mb: pxToRem(16) }} justifyContent='space-between'>
              <Typography>포인트 사용</Typography>
              <Typography variant={'Kor_16_b'}>
                {usePoint != 0 && (
                  '-'
                )}
                {numberComma(usePoint)}
                <Typography variant={'Kor_14_r'}>&nbsp;{payment.currencyCd?.value}</Typography>
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', borderTop: '1px solid #EEEEEE' }} justifyContent='space-between'>
              <Typography variant={'Kor_16_b'} sx={{ mt: pxToRem(16) }}>총 결제금액</Typography>
              <Typography variant={'Kor_16_b'} sx={{ color: '#FF6F00', fontSize: pxToRem(23), fontWeight: 600, mt: pxToRem(16) }}>
                {numberComma(payment.totPaymentAmt - usePoint)}
                <Typography variant={'Kor_14_r'}>&nbsp;{payment.currencyCd?.value}</Typography>
              </Typography>
            </Box>
          </Stack>
        )}
      </Stack>
      <Divider sx={{ borderColor: '#FAFAFA' }}/>
    </>
  );
});

export default AmtInfoItem;

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => {
  const ref = React.useRef<any>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Tooltip
      id="customized-tooltip-announce"
      ref={ref}
      {...props}
      classes={{ popper: className }}
      arrow
      open={isOpen}
      onClick={() => setIsOpen((open) => !open)}
      onClose={() => setIsOpen(false)}
      enterDelay={0}
      enterTouchDelay={0}
      enterNextDelay={0}
      leaveTouchDelay={0}
      leaveDelay={0}
    />
  );
})(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    marginTop: '6px !important',
    ...theme.typography.Kor_12_b,
    breakWord: 'break-all !important',
    backgroundColor: 'rgba(93, 96, 102, 0.95)',
    color: '#FFFFFF',
    maxWidth: 266,
    marginLeft: 20,
    marginRight: 20,
    padding: 12,
    paddingBottom: 8,
    border: '1px solid rgba(93, 96, 102, 0.95)',
    '& .MuiTooltip-arrow:before ': {
      backgroundColor: 'rgba(93, 96, 102, 0.95)',
    },
  },
}));