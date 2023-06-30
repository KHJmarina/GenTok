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
} from '@mui/material';
import { useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from '../../../../../../models/root-store/root-store-context';
import { ReactComponent as IconCoin } from 'src/assets/icons/ico-coin.svg';
import { pxToRem } from 'src/theme/typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ReactComponent as IconGenotypeCandy } from 'src/assets/icons/ico-genotype-candy.svg';
import { convertCtegryToValue } from 'src/screens/user/mypage/Mypage';
import { ReactComponent as IconCandy } from 'src/assets/icons/ico-candy-green.svg';
/**
 * ## GenoData 설명
 *
 */
export const GenoData = observer(() => {
  const rootStore = useStores();
  const { dnaCardDetailStore, loadingStore } = rootStore;
  const theme = useTheme();
  const [accdn, setAccdn] = useState<boolean>(false);
  const [genoMyDescr, setGenoMyDescr] = useState('');
  const [goodsNm, setGoodsNm] = useState('');
  const [genoTypeCnt, setGenoTypeCnt] = useState(0);
  const [myWorstGenoTypeCnt, setMyWorstGenoTypeCnt] = useState(0);
  const [genoAvgDescr, setGenoAvgDescr] = useState('');
  const [genevAvgCnt, setGenevAvgCnt] = useState(0);
  
  const dnaColors = useMemo(() => {
    switch (dnaCardDetailStore?.dnaCardDetail.ctegryList[0]?.ctegrySid) {
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
    dnaCardDetailStore?.dnaCardDetail.ctegryList,
    theme.palette.dna.eatingHabits,
    theme.palette.dna.healthcare,
    theme.palette.dna.nutrient,
    theme.palette.dna.personalCharacteristics,
    theme.palette.dna.skinHair,
    theme.palette.dna.workOut,
  ]);
  
  
  const handleChange = (event: React.SyntheticEvent) => {
    setAccdn(!accdn);
  };

  useEffect(() => {
    setGenoMyDescr(dnaCardDetailStore.dnaCardDetail?.geno?.genoMyDescr||'');
    setGoodsNm(dnaCardDetailStore.dnaCardDetail?.goodsNm||'');
    setGenoTypeCnt(dnaCardDetailStore.dnaCardDetail?.geno?.genoTypeCnt||0);
    setMyWorstGenoTypeCnt(dnaCardDetailStore.dnaCardDetail?.geno?.myWorstGenoTypeCnt||0);
    setGenoAvgDescr(dnaCardDetailStore.dnaCardDetail?.geno?.genoAvgDescr||'');
    setGenevAvgCnt(dnaCardDetailStore.dnaCardDetail?.geno?.genevAvgCnt||0);
  });

  return (
    <>
      <Box sx={{ p: 2.5 }}>
        <Typography variant={'Kor_22_b'} component={'p'} sx={{ textAlign: 'left', mb: 1, mt: 2 }}>
          당신의 유전형은
        </Typography>
        <List
          sx={{
            listStyleType: 'disc',
            pl: 2,
            fontSize: pxToRem(15),
            fontWeight: 400,
            color: '#5D6066',
          }}
        >
          <ListItem sx={{ display: 'list-item', p: 0, mb: 1 }}>
            {/* {dnaCardDetailStore.dnaCardDetail?.geno
              ?.genoMyDescr!.replace(/__goodsNm__/gi, dnaCardDetailStore.dnaCardDetail?.goodsNm!)
              .replace(
                /__genoTypeCnt__/gi,
                dnaCardDetailStore.dnaCardDetail?.geno?.genoTypeCnt!.toString(),
              )
              .replace(
                /__myWorstGenoTypeCnt__/gi,
                dnaCardDetailStore.dnaCardDetail.geno?.myWorstGenoTypeCnt!.toString(),
              )} */}
              {
              genoMyDescr.replace(/__goodsNm__/gi, goodsNm)
              .replace(/__genoTypeCnt__/gi,genoTypeCnt.toString())
              .replace(/__myWorstGenoTypeCnt__/gi,myWorstGenoTypeCnt.toString())
              }
          </ListItem>
          <ListItem sx={{ display: 'list-item', p: 0 }}>
            {/* {dnaCardDetailStore.dnaCardDetail.geno?.genoAvgDescr!.replace(
              /__genevAvgCnt__/gi,
              dnaCardDetailStore.dnaCardDetail?.geno?.genevAvgCnt!.toString(),
            )} */}
            {
              genoAvgDescr.replace(/__genevAvgCnt__/gi,genevAvgCnt.toString())
            }
          </ListItem>
        </List>
      </Box>

      {dnaCardDetailStore.dnaCardDetail?.dnaList?.map((dnaData: any, index: number) => {
        return (
          <Box sx={{ px: 2.5, pb: pxToRem(12) }} key={dnaData}>
            <Accordion
              key={`Accordion`+index}
              // defaultExpanded={index === 0 ? true : false}
              defaultExpanded={true}
              onClick={handleChange}
              sx={{
                mb: pxToRem(12),
                border: '1px solid #EEEEEE',
                borderRadius: '10px',
                overflowX: 'scroll',
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
                justifyContent: 'center',
                '&.MuiAccordion-root.Mui-expanded': {
                  mt: 0,
                  boxShadow: 'none',
                },
                '&.MuiAccordion-root.Mui-expanded:before': {
                  opacity: 1,
                },
              }}
            >
              <AccordionSummary
                key={`summary`+index}
                expandIcon={<ExpandMoreIcon sx={{ color: '#DFE0E2' }} />}
                sx={{
                  mx: 0,
                  my: 1,
                  pl: 3,
                  pr: 3,
                  width: '100%',
                  height: '3.75rem',
                  // backgroundColor: '#FAFAFA',
                  // border: '1px solid #EEEEEE',
                  // borderRadius: '10px',
                  '& .MuiAccordionSummary-content': {
                    display: 'flex',
                    alignItems: 'center',
                  },
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
                  key={`typograpy1`+index}
                  sx={{
                    // mr: pxToRem(6),
                    color: dnaColors.primary,
                    // fontWeight: 600,
                    // fontSize: pxToRem(19),
                    textAlign: 'left',
                    flex: '0 0 auto',
                  }}
                >
                  {dnaData?.dna}
                </Typography>
                <Typography variant="Kor_16_r" key={`typograpy2`+index} sx={{ textAlign: 'left' }}>{dnaData?.dnaNm}</Typography>
                </Box>
              </AccordionSummary>
              
              <AccordionDetails key={`details`+index} sx={{ px: pxToRem(24) }}>
                <Typography key={`typograpy3`+index} sx={{ textAlign: 'left', color: '#5D6066', mb: pxToRem(16) }}>
                  {dnaData?.dnaDescr}
                </Typography>
              
              { dnaCardDetailStore.dnaCardDetail?.dnaList[index]?.affectList.length > 0
                ? <Divider key ={`divider`+ index} sx={{ border: '0.5px solid #EEEEEE' }} />
                : ''
              }
                  
                {dnaCardDetailStore.dnaCardDetail?.dnaList[index]?.affectList?.map(
                  (affectData: any, i: number) => {
                    return (
                      <Box
                        key={affectData}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: pxToRem(14),
                            fontWeight: 400,
                            textAlign: 'left',
                            my: '1rem',
                            display:'flex',
                            alignItems: 'center',
                          }}
                        >
                          <span
                            style={{
                              color: '#C6C7CA',
                              fontSize: pxToRem(10),
                              fontWeight: 400,
                              marginRight: pxToRem(4),
                              lineHeight: pxToRem(12),
                            }}
                          >
                            {dnaCardDetailStore.dnaCardDetail?.dnaList[index]?.affectList.length>1 ? (i + 1)+`)` : ''}
                            
                          </span>
                          영향인자 <span style={{fontWeight: 600}}>{affectData?.effectAllele}</span>
                        </Typography>

                        <Box
                          key={`box`+i}
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyItem: 'center',
                            justifyContent: 'space-around',
                            alignItems: 'center',
                            borderRadius: pxToRem(100),
                            backgroundColor: '#FAFAFA',
                            width: '7.75rem',
                            height: '1.88rem',
                          }}
                        >
                          {dnaCardDetailStore.dnaCardDetail?.dnaList[index]?.affectList[
                            i
                          ]?.snpList?.map((item: any, idx: number) => {
                            return (item ==
                              dnaCardDetailStore.dnaCardDetail?.dnaList[index]?.affectList[i]
                                .snp ? (
                              <Box key={`box1`+item}>
                                <Typography
                                  key = {item}
                                  sx={{ color: '#DFE0E2', fontSize: pxToRem(14), fontWeight: 600 }}
                                >
                                  <span 
                                    key={`span`+index}
                                    style={{ color: 
                                    dnaCardDetailStore.dnaCardDetail?.dnaList[index]?.affectList[i].snp?.substring(0, 1)
                                    === dnaCardDetailStore.dnaCardDetail.dnaList[index]?.affectList[i]?.effectAllele!
                                    ? theme.palette.primary.main : '#202123'}}>
                                    
                                    {dnaCardDetailStore.dnaCardDetail?.dnaList[index]?.affectList[
                                      i
                                    ].snp?.substring(0, 1)}
                                  </span>
                                  <span 
                                  key={`span2`+index}
                                  style={{ color: 
                                    dnaCardDetailStore.dnaCardDetail?.dnaList[index]?.affectList[i].snp?.substring(1, 2)
                                    === (dnaCardDetailStore.dnaCardDetail.dnaList[index]?.affectList[i]?.effectAllele!)
                                    ? theme.palette.primary.main : '#202123'}}>
                                    {dnaCardDetailStore.dnaCardDetail?.dnaList[index]?.affectList[
                                      i
                                    ].snp?.substring(1, 2)}
                                  </span>
                                </Typography>
                              </Box>
                            ) : (
                              <Box key={`box2`+item}>
                              <Typography
                                key={item+idx}
                                sx={{
                                  color: '#DFE0E2',
                                  fontSize: pxToRem(14),
                                  fontWeight: 600,
                                }}
                                >
                                {item}
                              </Typography>
                              </Box> 
                            ))
                          })}
                        </Box>
                      </Box>
                    );
                  },
                )}
              </AccordionDetails>
            </Accordion>
          </Box>
        );
      })}

      <Divider sx={{ borderWidth: 6, mt:pxToRem(40) }}></Divider>
    </>
  );
});

export default GenoData;
