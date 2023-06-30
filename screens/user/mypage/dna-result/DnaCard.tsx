import { Box, Stack, useTheme, Typography, Tabs, Tab, Divider } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useEffect, useState, useCallback } from 'react';
import { useStores } from '../../../../models/root-store/root-store-context';
import { useNavigate, useParams } from 'react-router';
import { CHeader } from 'src/components/CHeader';
import SearchIcon from '@mui/icons-material/Search';
import { pxToRem } from 'src/theme/typography';
import { TabContext, TabPanel } from '@mui/lab';
import DnaResultDetail from './dna-result-detail/DnaResultDetail';
import LifeTips from './dna-result-detail/LifeTips';
import { DnaDetailCard } from './dna-result-detail/detail-card/DnaDetailCard';
import { DnaDetailGoldCard } from './dna-result-detail/detail-card/DnaDetailGoldCard';
import { PATH_ROOT } from '../../../../routes/paths';
import CAlert from 'src/components/CAlert';
import { useLocation } from 'react-router-dom';
import Slider from 'react-slick';
import { styled } from '@mui/material/styles';
import { convertCtegryToValue } from 'src/screens/user/mypage/Mypage';

/**
 * ## DnaCard 설명
 *
 */

export const DnaCard = observer(() => {
  const rootStore = useStores();
  const { dnaCardDetailStore, dnaResultStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();
  const [value, setValue] = useState<string>('tab1');

  const { singleGoodsSid: singleGoodsSid } = useParams();
  const [render, setRender] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const { state } = useLocation();
  const [initial, setInitial] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const getDnaCardDetailData = useCallback(
    async (param: number) => {
      await dnaCardDetailStore.getDnaCardDetail(param);

      if (dnaCardDetailStore.dnaCardDetail.ctegryList.length > 0) {
        // ctegrySid 파악하여 확인 불가 알럿

        let filterCode = '';
        if (state && state.filter) {
          filterCode = state.filter.code;
        }
        //스와이프 동작을 위해 내 결과카드 조회
        await dnaResultStore.getDna(
          true,
          filterCode,
          state && state.ctegrySid == 0
            ? ''
            : dnaCardDetailStore.dnaCardDetail.ctegryList[0].ctegrySid,
        );

        setRender(true);
        const list = dnaResultStore.myResult.resultList.find(
          (item) => item.singleGoodsSid === param,
        );
        if (list) {
          setInitial(dnaResultStore.myResult.resultList.indexOf(list));
        }
      } else {
        setAlertOpen(true);
        // window.history.pushState(null,'',window.location.href);  // 바로 전 페이지로 가야하기때문에 확인 불가 상품 알림창은 navigate를 쌓지 않는다 
      }
    },
    [dnaCardDetailStore, dnaResultStore],
  );

  const settings = {
    infinite: true,
    centerMode: true,
    slidesToShow: 1,
    speed: 100,
    arrows: false,
    dots: false,
    variableWidth: true,
    adaptiveHeight: true,
  };

  useEffect(() => {
    // window.addEventListener('popstate', () => {
    //   setAlertOpen(false);
    // });
    
    const param = parseInt(singleGoodsSid!);
    // console.log("length : ",  dnaCardDetailStore.dnaCardDetail?.ctegryList!)
    // dnaCardDetailStore.dnaCardDetail.ctegryList.length> 0 ? getDnaCardDetailData(param) : noData()
    getDnaCardDetailData(param);
  }, [singleGoodsSid, getDnaCardDetailData]);

  const [width, setWidth] = useState(0);
  useEffect(() => {
    const handleResize = () => {
      setWidth(Math.max(Math.min(window.innerWidth, 768) - 24, 300));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const options: any = {
    showMainIcon: 'back',
    showListIcon: true,
    handleList: () => {
      navigate(`${PATH_ROOT.user.mypage.dnaResult}?ctegrySid=0&page=list`)
    },
    showSearchIcon: true,
    handleSearch: () => {
      navigate(PATH_ROOT.user.mypage.searchDnaCard);
    }
  };

  return (
    <>
      {render && (
        <Stack sx={{ height: '100%' }}>
          <Stack>
            <CHeader
              title={
                dnaCardDetailStore.dnaCardDetail.ctegryList[0]?.ctegryNm
                  ? dnaCardDetailStore.dnaCardDetail?.ctegryList[0]?.ctegryNm!
                  : '결과 카드 상세'
              }
              {...options}
            />
          </Stack>

          <SliderStyle width={width} cardCnt={dnaResultStore.myResult.resultList.length}>
            <Slider
              {...settings}
              initialSlide={initial}
              beforeChange={(prev, next) => {
                navigate(
                  `${PATH_ROOT.user.mypage.dnaCard}/${dnaResultStore.myResult.resultList[next].singleGoodsSid}`,
                  { replace: true, state: { ...state } },
                );
              }}
            >
              {dnaResultStore.myResult.resultList.map((card, index: number) =>
                card?.goldCardYn === true ? (
                  <DnaDetailGoldCard key={index} dnaCard={card} goodsSid={singleGoodsSid} />
                ) : (
                  <DnaDetailCard
                    key={index}
                    dnaCard={card}
                    bgColor={
                      card.singleGoodsSid === Number(singleGoodsSid)
                        ? `${
                            theme.palette.dna[
                              convertCtegryToValue(Number(card?.ctegryList[0]?.ctegrySid))
                            ].pastel
                          }`
                        : '#F5F5F5'
                    }
                    goodsSid={singleGoodsSid}
                  />
                ),
              )}
            </Slider>
          </SliderStyle>

          {dnaCardDetailStore.dnaCardDetail.tips ? (
            <TabContext value={value}>
              <Box>
                <Stack sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="fullWidth"
                    aria-label="like tabs"
                  >
                    <Tab
                      label={
                        <span
                          style={{ fontSize: '1rem', fontWeight: value === 'tab1' ? 600 : 400 }}
                        >
                          결과 해석 &nbsp;
                          <span
                            style={
                              value === 'tab1'
                                ? { color: theme.palette.primary.main }
                                : { color: theme.palette.grey[400] }
                            }
                          ></span>
                        </span>
                      }
                      sx={{
                        width: '50%',
                        '&:not(.Mui-selected)': {
                          color: theme.palette.grey[400],
                        },
                      }}
                      value={'tab1'}
                    />
                    <Tab
                      label={
                        <span
                          style={{ fontSize: '1rem', fontWeight: value === 'tab2' ? 600 : 400 }}
                        >
                          생활 TIP &nbsp;
                          <span
                            style={
                              value === 'tab2'
                                ? { color: theme.palette.primary.main }
                                : { color: theme.palette.grey[400] }
                            }
                          ></span>
                        </span>
                      }
                      sx={{
                        width: '50%',
                        '&:not(.Mui-selected)': {
                          color: theme.palette.grey[400],
                        },
                      }}
                      value={'tab2'}
                    />
                  </Tabs>
                </Stack>
              </Box>
              <TabPanel value={'tab1'} sx={{ m: 0, p: 0 }}>
                <DnaResultDetail />
              </TabPanel>

              <TabPanel value={'tab2'} sx={{ m: 0, p: 0 }}>
                <LifeTips />
              </TabPanel>
            </TabContext>
          ) : (
            <Stack>
              <Box sx={{ mb: pxToRem(10) }}>
                <Typography variant={'Kor_16_b'}>결과해석</Typography>
              </Box>
              <Divider
                sx={{ borderWidth: pxToRem(1), borderColor: theme.palette.primary.main }}
              ></Divider>
              <DnaResultDetail />
            </Stack>
          )}
        </Stack>
      )}
      {alertOpen && (
        <CAlert
          isAlertOpen={alertOpen}
          alertCategory={'f2d'}
          alertTitle={'확인 불가한 상품입니다.'}
          hasCancelButton={false}
          hasXbutton={false}
          handleAlertClose={() => {
            setAlertOpen(false);
            navigate(-1);
          }}
          callBack={() => {
            navigate(-1);
          }}
        />
      )}
    </>
  );
});

export default DnaCard;

const SliderStyle = styled('div')(({ width, cardCnt }: { width: number, cardCnt: number, }) => ({
  '.slick-slide': {
    transform: 'translateY(-50px) scale(1, 0.64)',
    '&>div': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      borderRadius: '15px',
      backgroundColor: '#F5F5F5',
    },
  },

  '.slick-center, .slick-active': {
    zIndex: 1,
    transform: 'scale(1)',
    '&>div': {
      backgroundColor: 'transparent',
    },
  },
  '.slick-slide, .slick-track': {
    width: cardCnt > 1 ? `${width}px` : '100% !important',
  }
}));
