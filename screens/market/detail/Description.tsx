import { Box, Divider, Typography, useTheme } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { ReactComponent as IconCandy } from 'src/assets/icons/ico-candy-green.svg';
import { IDnaModel, IGoodsDnaModel, IGoodsModel } from 'src/models/market-store/Goods';
import { Card } from '../components/Card';
import { CardPopular } from './CardPopular';
import { ContentBox } from './ContentBox';

export interface IDescriptionProps {
  goods?: IGoodsModel;
}

export const Description = observer(({ goods }: IDescriptionProps) => {
  const theme = useTheme();
  const dnaColors = useMemo(() => {
    switch (goods?.ctegryList[0]?.ctegrySid) {
      case 1: // 영양소
        return theme.palette.dna.nutrient;
      case 2: // 운동
        return theme.palette.dna.workOut;
      case 3: // 피부/모발
        return theme.palette.dna.skinHair;
      case 4: // 식습관
        return theme.palette.dna.eatingHabits;
      case 5:
        // 개인특성
        return theme.palette.dna.personalCharacteristics;
      case 6:
        // 건강관리
        return theme.palette.dna.healthcare;
      default:
        return theme.palette.dna.nutrient;
    }
  }, [
    goods?.ctegryList,
    theme.palette.dna.eatingHabits,
    theme.palette.dna.healthcare,
    theme.palette.dna.nutrient,
    theme.palette.dna.personalCharacteristics,
    theme.palette.dna.skinHair,
    theme.palette.dna.workOut,
  ]);

  return (
    <>
      {!goods?.packageYn && (goods?.goodsDnaList?.length || 0) > 0 && (
        <Card>
          <Typography
            variant="Kor_22_b"
            component="div"
            sx={{
              textAlign: 'left',
            }}
          >
            이런 DNA를 알 수 있어요!
          </Typography>

          <ContentBox>
            {goods?.goodsDnaList?.map((dna: IGoodsDnaModel) => {
              return dna.dnaList.map((item: IDnaModel) => (
                <Box
                  key={`goods-goodsDnaList-dnaList-dna-${item.dnaSid}`}
                  sx={{
                    display: 'flex',
                    padding: '16px 20px',
                    borderRadius: '10px',
                    borderColor: '#EEEEEE',
                    borderStyle: 'solid',
                    borderWidth: '1px',
                    borderAlign: 'Inside',
                    alignItems: 'center',
                    // alignItems: 'flex-start',
                  }}
                >
                  <Box
                    sx={{
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      backgroundColor: dnaColors.base,
                    }}
                  >
                    <IconCandy style={{ flex: '0 0 auto' }} fill={dnaColors.primary} />
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      marginLeft: '12px',
                    }}
                  >
                    <Typography
                      variant="Eng_16_b"
                      component={'div'}
                      style={{
                        color: dnaColors.primary,
                        textAlign: 'left',
                        flex: '0 0 auto',
                      }}
                    >
                      {item.dna}
                    </Typography>
                    <Typography variant="Kor_16_r" component={'div'} style={{ textAlign: 'left' }}>
                      {item.dnaNm}
                    </Typography>
                  </Box>
                </Box>
              ));
            })}
          </ContentBox>
        </Card>
      )}
      <Divider />

      {!goods?.packageYn && (goods?.resultPairList?.length || 0) > 0 && (
        <CardPopular goods={goods} />
      )}

      {/* <CardGoldClass /> */}
    </>
  );
});
