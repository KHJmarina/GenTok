import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useStores } from 'src/models/root-store/root-store-context';
import { Typography, Grid, Stack, Tab, TabProps, Tabs, TabsProps, useTheme } from '@mui/material';
import { TabContext } from '@mui/lab';
import Carousel from 'src/components/carousel';
import { HEADER } from 'src/config-global';
import { alpha, styled } from '@mui/material/styles';
import { bgBlur } from 'src/utils/cssStyles';
import { useLocation, useNavigate, useRoutes } from 'react-router-dom';
import { CallApiToStore } from 'src/utils/common';
import { IMbtiSnapshot } from 'src/models/mbti/Mbti';
import { useScroll } from 'framer-motion';
import { IContentSnapshot } from 'src/models/content/Content';
import { debounce, reject } from 'lodash';
import { IGameSnapshot } from 'src/models/game/Game';
import { pxToRem } from 'src/theme/typography';
import { Page } from 'src/components/Page';
import type_imm from '../../../assets/images/type.svg';
import SearchInput from './SearchInput';
import ContentItem from 'src/screens/home/content-item/ContentItem';
import GoodsItem from 'src/screens/home/goods-item/GoodsItem';
import { toJS } from 'mobx';
import { getValue } from '@mui/system';

/**
 * ## ContentResult 설명
 *
 */

interface Props {
  type?: string;
}
export const ContentsResult = observer(({}: Props) => {
  const rootStore = useStores();
  const { contentStore, mbtiStore, loadingStore } = rootStore;
  const theme = useTheme();
  const { state } = useLocation();

  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(document.location.search);
  const contentIndex = useRef(0);

  /**
   * 검색
   * 검색 키워드 : getKeyword
   * 검색 결과 : getKeywordResult
   */

  const getContents = (state: any, isAdd: boolean, isReset: boolean) => {
    CallApiToStore(contentStore.getsSearch(state, isAdd, true), 'api', loadingStore);
  };

  const getKeyword = (text: any) => {
    setKeyword(text);
  };

  useEffect(() => {
    getContents(state, true, true);
    contentStore.reset();
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
              getContents(state, false, true);
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
      <Page title="" sx={{ p: 0 }}>
        <SearchInput contentsType={''} keyword={getKeyword}></SearchInput>
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box
              sx={{
                textAlign: 'start',
                minHeight: pxToRem(40),
                px: pxToRem(20),
                py: pxToRem(10),
              }}
            >
              <Typography variant="Kor_14_b" mr={1}>
                유형 테스트
              </Typography>
              <Typography variant="Kor_14_b" color={theme.palette.primary.main}>
                {contentStore.pagination.totalElements} {/* TODO 검색결과 숫자 */}
              </Typography>
            </Box>
            <Box
              sx={{
                textAlign: 'start',
                minHeight: pxToRem(40),
                px: pxToRem(20),
                py: pxToRem(10),
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
              onClick={() => {
                navigate('/contents');
              }}
            >
              <Typography variant="Kor_14_r" mr={1}>
                전체보기
              </Typography>
            </Box>
          </Box>
          {contentStore.contents.length > 0 ? (
            <Box sx={{ flex: 1, pt: '3px', scrollMarginTop: '130px' }}>
              <Box sx={{ flexGrow: 1, flex: 1, minHeight: `calc(100vh - 200px)` }}>
                <Grid container spacing={1} justifyContent={'space-between'} sx={{ px: '20px' }}>
                  {contentStore.contents.map((content: IContentSnapshot, i: number) => (
                    <Grid key={`best-${i}`} item xs={6} sm={6} md={6} sx={{ mb: '16px' }}>
                      <ContentItem data={content} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>
          ) : (
            <>
              <Box
                component={'img'}
                src={type_imm}
                sx={{
                  mx: 'auto',
                  width: pxToRem(24),
                  mt: pxToRem(25),
                }}
              ></Box>
              <Typography
                variant={'Kor_16_r'}
                color={'#C6C7CA'}
                sx={{
                  mt: pxToRem(20),
                }}
              >
                검색 결과가 없습니다.
              </Typography>
            </>
          )}
        </>
      </Page>
    </>
  );
});

export default ContentsResult;
