import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useStores } from 'src/models/root-store/root-store-context';
import { Typography, Grid, Stack, Tab, TabProps, Tabs, TabsProps, useTheme } from '@mui/material';
import { TabContext } from '@mui/lab';
import GoodsItem from '../home/goods-item/GoodsItem';
import Carousel from 'src/components/carousel';
import { HEADER } from 'src/config-global';
import { alpha, styled } from '@mui/material/styles';
import { bgBlur } from 'src/utils/cssStyles';
import { useLocation, useNavigate, useRoutes } from 'react-router-dom';
import { CallApiToStore } from 'src/utils/common';
import { IMbtiSnapshot } from 'src/models/mbti/Mbti';
import { useScroll } from 'framer-motion';
import { IContentSnapshot } from 'src/models/content/Content';
import ContentItem from '../home/content-item/ContentItem';
import { debounce, reject } from 'lodash';
import { IGameSnapshot } from 'src/models/game/Game';
import { pxToRem } from 'src/theme/typography';
import { Page } from 'src/components/Page';
import SearchInput from './Search/SearchInput';
import type_imm from '../../assets/images/type.svg';

/**
 * ## Test 설명
 *
 */

const MarketTabs = styled((props: StyledTabsProps) => <Tabs {...props} />)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.primary.main,
    height: '1px',
  },
  paddingBottom: pxToRem(20),
  '& .MuiTabs-flexContainer': {
    paddingRight: '20px',
    display: 'block',
    width: 'fit-content',
  },
}));

const MarketTab = styled((props: StyledTabProps) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: 'none',
    minWidth: 0,
    [theme.breakpoints.up('sm')]: {
      minWidth: 0,
    },
    alignItems: 'flex-end',
    margin: '0 10px 4px 10px !important',
    minHeight: pxToRem(40),
    fontSize: pxToRem(16),
    letterSpacing: '-3%',
    marginRight: theme.spacing(1),
    color: '#000000 !important',
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover': {
      opacity: 1,
    },
    '&.Mui-selected': {
      color: `${theme.palette.primary.main} !important`,
      fontWeight: theme.typography.fontWeightMedium,
    },
    '&:first-of-type': {
      marginLeft: `${pxToRem(20)} !important`,
    },
    '&:last-of-type': {
      marginRight: `${pxToRem(20)} !important`,
    },
  }),
);

interface StyledTabsProps extends TabsProps {}

interface StyledTabProps extends TabProps {}

interface Props {
  type?: string;
}
export const Test = observer(({ type = 'best' }: Props) => {
  const rootStore = useStores();
  const { contentStore, mbtiStore, loadingStore, gameStore } = rootStore;
  const theme = useTheme();
  const { pathname } = useLocation();
  const push = useNavigate();
  const replace = useNavigate();

  const [keyword, setKeyword] = useState('');
  const [keywordResult, setKeywordResult] = useState(false);

  const searchParams = new URLSearchParams(document.location.search);
  const tabName = searchParams.get('tab') || type;
  console.log(tabName);
             

  useEffect(() => {
    // console.log('🌈 ~ Test ~ tabName:', tabName)
    const next = tabName === 'mbti' ? 1 : tabName === 'game' ? 2 : 0;
    carouselRef.current?.slickGoTo(next);
    contentIndex.current = next;
  }, [tabName]);

  const [currentTab, setTab] = useState(tabName);
  const switchTab = (_: any, newTab: string) => {
    setTab(newTab);
    if (typeof window !== 'undefined') {
      if (newTab !== currentTab) {
        window.history.pushState(null, '', `?tab=${newTab}`);
      }
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', () => {
        const params = new URLSearchParams(window.location.search);
        const newTab = params.get('tab');
        if (newTab) setTab(newTab);
      });
    }
  }, []);

  let firstIndex = tabName === 'mbti' ? 1 : tabName === 'game' ? 2 : 0;
  // let firstIndex = type === 'mbti' ? 1 : type === 'game' ? 2 : 0;

  const [tabValue, setTabValue] = useState<number>(firstIndex);
  const contentIndex = useRef(firstIndex);

  const handleTabChange = debounce((event: React.SyntheticEvent, next: number) => {
    switchTab(null, next === 1 ? 'mbti' : next === 2 ? 'game' : 'main');
    carouselRef.current?.slickGoTo(next);
    contentIndex.current = next;
    // setTabValue((v) => {
    //   return (v = next);
    // });
  }, 200);

  function a11yProps(index: number) {
    return {
      id: `contents-tab-${index}`,
      'aria-controls': `contents-tabpanel-${index}`,
    };
  }

  const contentRef = useRef<any>(null);
  const carouselRef = useRef<Carousel | null>(null);
  const carouselSettings = {
    dots: false,
    arrows: false,
    autoplay: false,
    draggable: true,
    slidesToShow: 1,
    initialSlide: firstIndex,
    rtl: false,
    speed: 400,
    // infinite: true,
    // easing: 'easeOut',
    centerMode: false,
    swipeToSlide: true,
    adaptiveHeight: true,
    beforeChange: (current: number, next: number) => {
      // switch (next) {
      //   case 0:
      //     contentStore.contents.length < 1 && contentStore.gets();
      //     break;
      //   case 1:
      //     mbtiStore.mbtis.length < 1 && mbtiStore.gets();
      //     break;
      //   case 2:
      //     gameStore.games.length < 1 && gameStore.gets()
      //     break;
      // }

      // contentRef.current?.scrollIntoView(100);
      if (firstIndex !== next) {
        // 메뉴 활성화를 위해..
        // push('/contents/' + (next === 1 ? 'mbti' : next === 2 ? 'game' : ''))
      }
      contentIndex.current = next;
      setTabValue((v) => {
        return (v = next);
      });
    },
  };

  const getContents = () => {
    switch (contentIndex.current) {
      case 0:
        CallApiToStore(contentStore.gets(), 'api', loadingStore).then(() => {});
        break;
      case 1:
        CallApiToStore(mbtiStore.gets(), 'api', loadingStore).then(() => {});
        break;
      case 2:
        gameStore.games.length < 1 && gameStore.gets();
        break;
    }
  };

  /**
   * 검색
   * 검색 키워드 : getKeyword
   * 검색 결과 : getKeywordResult
   */

  const getKeyword = (text: any) => {
    setKeyword(text);
  };
  const code = contentStore.contents.filter((val) => {
    if (val.contsNm.includes(keyword)) {
      return val;
    }
  });

  // useEffect(() => {
  //   // console.log('type', type)
  //   const next = type === 'mbti' ? 1 : type === 'game' ? 2 : 0;
  //   handleTabChange({} as React.SyntheticEvent, next);
  // }, [type]);

  useEffect(() => {
    contentStore.reset();
    mbtiStore.reset();
    gameStore.reset();
    contentStore.gets();
    mbtiStore.gets();
    gameStore.gets();
  }, []);

  const addPage = async (): Promise<any> => {
    switch (contentIndex.current) {
      case 0:
        return new Promise((resolve, reject) => {
          if (!contentStore.pagination.last) {
            contentStore.pagination.setProps({
              page: contentStore.pagination.page + 1,
            });
            resolve(contentStore.pagination.page);
          } else {
            reject('last page'); // new Error('last page')
          }
        });

        break;
      case 1:
        return new Promise((resolve, reject) => {
          if (!mbtiStore.pagination.last) {
            mbtiStore.pagination.setProps({
              page: mbtiStore.pagination.page + 1,
            });
            resolve(mbtiStore.pagination.page);
          } else {
            reject('last page');
          }
        });

        break;
      case 2:
        break;
    }
  };

  const { scrollYProgress, scrollY } = useScroll();
  useEffect(() => {
    scrollYProgress.on('change', (v) => {
      if (v > 0.8) {
        if (!loadingStore.loading) {
          addPage()
            .then(() => {
              getContents();
            })
            .catch((e) => {});
        }
      }
    });
    return () => {
      contentStore.pagination.setProps({ page: 1 });
      mbtiStore.pagination.setProps({ page: 1 });
    };
  }, [console, contentStore, mbtiStore, scrollYProgress]);

  return (
    <>
      <Page title="DNA Market" sx={{ p: 0 }}>
        <SearchInput contentsType={''} keyword={getKeyword}></SearchInput>
        <>
          <MarketTabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons={false}
            allowScrollButtonsMobile
            aria-label="contents menu"
          >
            <MarketTab label="가장 인기있는" key={'contents-teb-1'} />
            <MarketTab label="MBTI" key={'contents-teb-2'} />
            <MarketTab label="1분컷 게임" key={'contents-teb-3'} />
          </MarketTabs>
          <Box sx={{ flex: 1, pt: '3px', scrollMarginTop: '130px' }} ref={contentRef}>
            <Carousel ref={carouselRef} {...carouselSettings}>
              <Box sx={{ flexGrow: 1, flex: 1, minHeight: `calc(100vh - 200px)` }}>
                <Grid container spacing={1} justifyContent={'space-between'} sx={{ px: '20px' }}>
                  {contentStore.contents.map((content: IContentSnapshot, i: number) => (
                    <Grid key={`best-${i}`} item xs={6} sm={6} md={6} sx={{ mb: '16px' }}>
                      <ContentItem data={content} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
              <Box sx={{ flexGrow: 1, minHeight: `calc(100vh - 200px)` }}>
                <Grid container spacing={1} justifyContent={'space-between'} sx={{ px: '20px' }}>
                  {mbtiStore.mbtis.map((mbti: IMbtiSnapshot, i: number) => (
                    <Grid key={`mbti-${i}`} item xs={6} sm={6} md={6} sx={{ mb: '16px' }}>
                      <GoodsItem data={mbti} type={'mbti'} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
              <Box sx={{ flexGrow: 1, flex: 1, minHeight: `calc(100vh - 200px)` }}>
                <Grid container spacing={1} justifyContent={'space-between'} sx={{ px: '20px' }}>
                  {gameStore.games.map((game: IGameSnapshot, i: number) => (
                    <Grid key={`game-${i}`} item xs={6} sm={6} md={6} sx={{ mb: '16px' }}>
                      <GoodsItem data={game} type={'game'} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Carousel>
          </Box>
        </>
      </Page>
    </>
  );
});

export default Test;
