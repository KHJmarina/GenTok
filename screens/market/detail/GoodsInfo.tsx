import { Box, Paper, Stack, Typography, styled, useTheme } from '@mui/material';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { ReactComponent as IconExclamation } from 'src/assets/icons/ico-exclamation-mark-circled.svg';
import { useStores } from 'src/models';
import { IGoodsModel } from 'src/models/market-store/Goods';
import { pxToRem } from 'src/theme/typography';

export interface IGoodsInfoProps {
  goods?: IGoodsModel;
}

export const GoodsInfo = observer(({ goods }: IGoodsInfoProps) => {
  return (
    <Paper
      sx={{
        borderRadius: 4,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        background: '#ffffff',
        marginTop: -5,
        zIndex: 1,
      }}
      elevation={0}
    >
      <Stack
        direction="column"
        sx={{
          flex: 1,
          pt: 4,
          pl: 2.5,
          pr: 2.5,
          pb: 4,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
          <Typography variant="Kor_14_b" component={'p'} color={'#9DA0A5'} sx={{ pb: pxToRem(12) }}>
            {goods?.packageYn ? '종합' : goods?.ctegryList.map((c) => c.ctegryNm).join(', ')}
          </Typography>

          <Typography
            variant="Kor_22_b"
            component={'div'}
            sx={{ pb: pxToRem(4), textAlign: 'left' }}
          >
            {goods?.goodsNm}
          </Typography>
          <Typography variant="Kor_20_r" component={'div'} sx={{ textAlign: 'left' }}>
            {goods?.goodsSummary}
          </Typography>

          <Box
            display="flex"
            sx={{
              mt: '20px',
              alignContent: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 1,
            }}
          >
            {goods?.dispDscntRate != null && goods?.dispDscntRate > 0 && (
              <Typography variant="Eng_20_b" color={'primary'}>
                {goods?.dispDscntRate}%
              </Typography>
            )}
            <Typography variant="Eng_20_b">
              {goods?.goodsAmtKWN}
              <Typography variant="Kor_14_b">{goods?.currencyCd?.value}</Typography>
            </Typography>
          </Box>
          {goods?.goodsAmtKWN != goods?.priceKWN && (
            <Typography
              variant="body2"
              sx={{ color: '#9DA0A5', lineHeight: pxToRem(22), textDecoration: 'line-through' }}
            >
              {goods?.priceKWN}
              {goods?.currencyCd?.value}
            </Typography>
          )}
        </Box>

        <Box sx={{ mt: 2.5, mb: 2.5, height: '1px', borderTop: 'solid 1px #EEEEEE' }} />

        <Box sx={{ gap: 2.5 }}>
          <Box sx={{ display: 'flex' }}>
            <Typography
              variant="Kor_14_b"
              component="div"
              sx={{
                color: '#9DA0A5',
                textAlign: 'left',
                display: 'inline-block',
                flex: '0 0 70px',
              }}
            >
              안내
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: pxToRem(14),
                fontWeight: 400,
                lineHeight: pxToRem(22),
                color: '#9da0a5',
                flex: 1,
                textAlign: 'left',
              }}
            >
              이번이 처음이라면, 키트 발송 3일 소요
              <br />
              처음이 아니라면, 키트 없이 결과 확인
              <HtmlTooltip
                title={
                  <React.Fragment>
                    추가분석동의 또는 인체유래물연구동의서에 동의한경우, 이후부터는
                    <span style={{ color: '#FF7F3F' }}>
                      키트를 추가 구매하지 않아도 서비스 이용이 가능
                    </span>
                    합니다.
                  </React.Fragment>
                }
              >
                <IconExclamation style={{ verticalAlign: 'middle' }} />
              </HtmlTooltip>
            </Typography>
          </Box>
        </Box>
      </Stack>
    </Paper>
  );
});

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
      // disableHoverListener={true}
      // disableInteractive={true}
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
    color: '#ffffff',
    maxWidth: 220,
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
