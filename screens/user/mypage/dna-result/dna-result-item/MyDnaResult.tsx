import { Box, Typography, Grid, useTheme } from '@mui/material';
import { observer } from "mobx-react-lite";
import { useNavigate } from 'react-router';
import Image from 'src/components/image/Image';
import { IDnaResultCard } from 'src/models/dna-result-card/DnaResultCard';
import { PATH_ROOT } from 'src/routes/paths';
import { convertCtegryToValue } from 'src/screens/user/mypage/Mypage';
import { pxToRem } from 'src/theme/typography';
import '../dna-result-detail/detail-card/dna-card-style.css';

/**
 * ## MyDnaResult 설명
 *
 */

interface Props {
  myResultList: IDnaResultCard[];
}

export const MyDnaResult = observer(({ myResultList } : Props) => {
  const navigate = useNavigate();
  const { REACT_APP_IMAGE_STORAGE } = process.env;
  const theme = useTheme();

  return (
    <Box sx={{ flexGrow: 1, mx: pxToRem(20) }}>
      <Grid container spacing={2}> 
        { myResultList.map((myResult: IDnaResultCard, index: number) => {
          return(
            <Grid 
              item xs={4} sm={4} md={4}
              key={index} 
              onClick={() => {navigate(`${PATH_ROOT.user.mypage.dnaCard}/${myResult.singleGoodsSid}`)}}
              sx={{ pb: pxToRem(10), cursor:'pointer' }}
            >
              <>
                { myResult.goldCardYn
                  ? (
                    <Box
                      sx={{
                        borderRadius: pxToRem(15), 
                        mb: pxToRem(8),
                        overflow: 'hidden',
                        position: 'relative',
                        zIndex: 0,
                      }}
                      className="infinity-flow-bg-up"
                    >
                    
                      <Image
                        ratio={'1/1'}
                        src={ myResult.testResultImgPath ? (REACT_APP_IMAGE_STORAGE + myResult.testResultImgPath) : '/assets/default-goods.svg' }
                        sx={{ 
                          borderRadius: pxToRem(15), 
                          height: pxToRem(92), 
                          overflow: 'hidden',
                          position: 'relative',
                          cursor:'pointer',
                        }}
                        onError={(e: any) => {
                          e.target.src = '/assets/default-goods.svg';
                        }}
                      />
                    </Box>
                  )
                  : (
                    <Image
                      ratio={'1/1'}
                      src={ myResult.testResultImgPath? (REACT_APP_IMAGE_STORAGE + myResult.testResultImgPath) : '/assets/default-goods.svg'}
                      sx={{ 
                        borderRadius: pxToRem(15), 
                        height: pxToRem(92), 
                        mb: pxToRem(8), 
                        background: `${theme.palette.dna[convertCtegryToValue(Number(myResult.ctegryList[0].ctegrySid!))].pastel}`
                      }}
                      onError={(e: any) => {
                        e.target.src = '/assets/default-goods.svg';
                      }}
                    />
                  )
                }
                <Typography sx={{ textAlign: 'center', fontSize: pxToRem(12), fontWeight: 400, lineHeight: pxToRem(18), wordBreak: 'keep-all' }}>{myResult.goodsNm}</Typography>
              </>
            </Grid>
          )
        })}
      </Grid>
    </Box>
  );
});
export default MyDnaResult;