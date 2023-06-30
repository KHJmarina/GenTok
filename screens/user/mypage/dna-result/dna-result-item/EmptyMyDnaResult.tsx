import { Box, Typography } from '@mui/material';
import { observer } from "mobx-react-lite";
import { pxToRem } from 'src/theme/typography';
import { ReactComponent as IconCarousel } from 'src/assets/icons/ico-dna-carousel.svg';

/**
 * ## EmptyMyDnaResult 설명
 *
 */

export const EmptyMyDnaResult = observer(() => {
  return (
    <Box 
      sx={{
        height: pxToRem(300),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <IconCarousel fill={'#9DA0A5'}/>
      <Typography variant={'body1'} color={'#C6C7CA'}>
        검사 결과가 없습니다.
      </Typography>
    </Box>
  );
});
export default EmptyMyDnaResult;