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
 * ## AllDnaResult 설명
 *
 */

interface Props {
  allResultList: IDnaResultCard[];
}

export const AllDnaResult = observer(({ allResultList }: Props) => {
  const navigate = useNavigate();
  const { REACT_APP_IMAGE_STORAGE } = process.env;
  const theme = useTheme();

  return (
    <Box sx={{ flexGrow: 1, mx: pxToRem(20) }}>
      <Grid container spacing={2}> 
        { allResultList.map((allResult: IDnaResultCard, index: number) => {
          return (
            <Grid 
              item xs={4} sm={4} md={4}
              key={index} 
              onClick={(e) => {
                allResult.mineYn == true
                ? navigate(`${PATH_ROOT.user.mypage.dnaCard}/${allResult.singleGoodsSid}`) 
                : e?.preventDefault()
              }}
              sx={{ pb: pxToRem(10) }}
            >
              <>
                { allResult.mineYn 
                  ? (
                      allResult.goldCardYn
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
                            src={ allResult.testResultImgPath ? (REACT_APP_IMAGE_STORAGE + allResult.testResultImgPath) : '/assets/default-goods.svg' }
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
                          src={ allResult.testResultImgPath ? (REACT_APP_IMAGE_STORAGE + allResult.testResultImgPath) : '/assets/default-goods.svg' }
                          sx={{ 
                            borderRadius: pxToRem(15), 
                            height: pxToRem(92), 
                            mb: pxToRem(8), 
                            background: `${theme.palette.dna[convertCtegryToValue(Number(allResult.ctegryList[0].ctegrySid!))].pastel}`,
                            cursor:'pointer' 
                          }}
                          onError={(e: any) => {
                            e.target.src = '/assets/default-goods.svg';
                          }}
                        />
                      )
                  )
                  : (
                      <Image
                        ratio={'1/1'}
                        src={ allResult.thumbnlPath? (REACT_APP_IMAGE_STORAGE + allResult.thumbnlPath) : '/assets/default-goods.svg'}
                        sx={{ borderRadius: pxToRem(15), height: pxToRem(92), mb: pxToRem(8), background: '#FAFAFA' }}
                        onError={(e: any) => {
                          e.target.src = '/assets/default-goods.svg';
                        }}
                      />
                  )
                }
                <Typography sx={{ textAlign: 'center', fontSize: pxToRem(12), fontWeight: 400, lineHeight: pxToRem(18), wordBreak: 'keep-all' }}>{allResult.goodsNm}</Typography>
              </>
            </Grid>
          )
        })}
      </Grid>
    </Box>
  );
});
export default AllDnaResult;