import Box from '@mui/material/Box';
import { Stack, Divider, Container, Card, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from '../../../../../../models/root-store/root-store-context';
import { useTheme } from '@mui/material';
import { pxToRem } from 'src/theme/typography';
import QuestionItems from './dna-card-survey/QuestionItems';
import { CallApiToStore } from 'src/utils/common';
import { toJS } from 'mobx';
/**
 * ## DnaCardSurvey 설명
 *
 */
export const DnaCardSurvey = observer(() => {
  const rootStore = useStores();
  const { dnaCardDetailStore, dnaCardSurveyStore, loadingStore } = rootStore;
  const theme = useTheme();
  const [onlyAblePrtcptn, setOnlyAblePrtcptn] = useState<boolean>(true);
  const [render, setRender] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const getDnaCardSurveyDetail = async (onlyAblePrtcpt: boolean) => {
    dnaCardDetailStore.dnaCardDetail?.surveySidList?.map((sid: number, index: number) => {
      CallApiToStore(
        dnaCardSurveyStore.getDnaCardSurveyDetail(sid, onlyAblePrtcpt),
        'api',
        loadingStore,
      ).then(() => {
        // console.log(toJS(dnaCardSurveyStore.dnaCardSurvey));
        setRender(true);
      });
    });
  };

  const handleNext = () => {
    if (currentIndex + 1 === dnaCardSurveyStore.dnaCardSurvey?.questnList.length) {
      // alert("설문 종료")
      setRender(false);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  useEffect(() => {
    getDnaCardSurveyDetail(onlyAblePrtcptn);
  }, []);

  return (
    <>
      {render && (
        <>
          <Container sx={{ backgroundColor: '#FAFAFA', width: '100%', py: 2 }}>
            <Card
              sx={{
                borderRadius: 1,
                m: 'auto',
              }}
            >
              <Stack>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    m: 1,
                  }}
                >
                  <Typography
                    sx={{
                      textAlign: 'left',
                      fontSize: pxToRem(18),
                      fontWeight: '600',
                      mx: 2,
                      mt: 2,
                    }}
                  >
                    {dnaCardSurveyStore.dnaCardSurvey?.questnList[currentIndex].questn}
                    {dnaCardSurveyStore.dnaCardSurvey?.questnList[currentIndex].mltplChoiceYn ? (
                      <>
                        <br />
                        <span style={{ fontSize: pxToRem(14), fontWeight: 400 }}>(중복가능)</span>
                      </>
                    ) : null}
                  </Typography>

                  <Typography variant={'body1'} sx={{ color: '#DFE0E2', fontWeight: '400', mr: 2 }}>
                    {currentIndex + 1}/{dnaCardSurveyStore.dnaCardSurvey?.questnCnt}
                  </Typography>
                </Box>
                <Typography
                  variant={'Kor_14_r'}
                  sx={{
                    color: '#9DA0A5',
                    textAlign: 'left',
                    mt: pxToRem(8),
                    ml: pxToRem(24),
                    mb: pxToRem(28),
                  }}
                >
                  설문 응답하고 포인트 적립하세요!
                </Typography>
              </Stack>

              {/* 응답 */}
              <QuestionItems
                question={dnaCardSurveyStore.dnaCardSurvey?.questnList[currentIndex]}
                index={currentIndex}
                handleNext={handleNext}
              />
            </Card>
          </Container>

          <Divider></Divider>
        </>
      )}
    </>
  );
});

export default DnaCardSurvey;
