import Box from '@mui/material/Box';
import {
  Stack,
  useTheme,
  Typography,
  Card,
  List,
  ListItem,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  styled,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { useStores } from '../../../../../../models/root-store/root-store-context';
import { ReactComponent as IconCoin } from 'src/assets/icons/ico-coin.svg';
import { pxToRem } from 'src/theme/typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ReactComponent as IconGenotypeCandy } from 'src/assets/icons/ico-genotype-candy.svg';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
/**
 * ## GenoData 설명
 *
 */
export const GenoRate = observer(() => {
  const rootStore = useStores();
  const { dnaCardDetailStore, loadingStore } = rootStore;
  const theme = useTheme();
  const [accdn, setAccdn] = useState<boolean>(true);

  const handleChange = (event: React.SyntheticEvent) => {
    setAccdn(!accdn);
  };
  useEffect(() => {});

  return (
    <>
      {dnaCardDetailStore.dnaCardDetail.geno?.genoRateStr ? (
        <>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              height: '110px',
              p: 2.5,
              justifyContent: 'space-between',
            }}
          >
            <Typography sx={{ fontSize: pxToRem(22), fontWeight: '600' }}>
              유전율
              <HtmlTooltip
                title={
                  <React.Fragment>
                    <Typography variant='Kor_12_b'>
                    현재 발현된 신체 상태나 외관을 결정하는 여러 요인들 중에 
                    <span style={{ color: '#FF7F3F'}}> 유전적 요인이 기여하는 비율</span>을 의미해요.
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
            <Box
              sx={{
                // display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 100,
                backgroundColor: '#FAFAFA',
                width: pxToRem(80),
                height: pxToRem(32),
                textAlign: 'center',
                // m: 'auto'
                fontSize: pxToRem(17),
                fontWeight: '600',
                display: 'inline-flex',
              }}
            >
              <Typography sx={{ fontSize: pxToRem(17), fontWeight: '600' }}>
                {dnaCardDetailStore.dnaCardDetail.geno?.genoRateStr!}%
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ borderWidth: 6 }}></Divider>
        </>
      ) : null}
    </>
  );
});

export default GenoRate;

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
