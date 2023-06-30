import { IconButton, useTheme, Box, Stack, Typography, Tabs, Tab, Grid } from '@mui/material';
import Iconify from 'src/components/iconify';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { useStores } from 'src/models/root-store/root-store-context';
import { TabContext, TabPanel } from '@mui/lab';
import { CHeader } from 'src/components/CHeader';
import Image from 'src/components/image/Image';
import { useNavigate, useParams } from 'react-router-dom';
import { HEADER, SPACING } from 'src/config-global';
import LikeTestItems from './like-test-items/LikeTestItems';
import LikeDnaItems from './like-dna-items/LikeDnaItems';
import { CallApiToStore } from 'src/utils/common';
import { ILikeSnapshot } from 'src/models';
import { debounce, reject } from 'lodash';
import { PATH_ROOT } from 'src/routes/paths';
import { ReactComponent as IconBack } from 'src/assets/icons/ico-back.svg';
import { pxToRem } from 'src/theme/typography';
import { Page } from '../../../../components/Page';

/**
 * ## Like 설명
 *
 */

interface Props {
  type?: string;
}

export const Like = observer(({ type = 'dna' }: Props) => {
  const rootStore = useStores();
  const { likeStore, loadingStore } = rootStore;
  const theme = useTheme();
  const navigate = useNavigate();

  const options: any = {
    showMainIcon: 'back',
    handleMainIcon: () => {
      navigate(PATH_ROOT.user.mypage.main);
    }
  };

  const searchParams = new URLSearchParams(document.location.search);
  const tabName = searchParams.get('tab') || type;

  const [value, setValue] = useState(tabName);

  const getDnaData = async () => {
    CallApiToStore(likeStore.gets(), 'api', loadingStore).then(() => {});
  };

  const getContentData = async () => {
    CallApiToStore(likeStore.getContents(), 'api', loadingStore).then(() => {});
  };

  useEffect(() => {
    likeStore.pagination.setProps({ size: 100 });
    getDnaData();
    getContentData();
  }, []);

  useEffect(() => {
    window.history.pushState(null, '', `?tab=${'dna'}`);

    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', () => {
        const params = new URLSearchParams(window.location.search);
        const newTab = params.get('tab');
        if (newTab) {
          setValue(newTab);
        }
        if (newTab == null){
          // window.history.pushState(null, '', `?tab=${'dna'}`);
          navigate(PATH_ROOT.user.mypage.main);
          // // window.history.back()
          // window.history.pushState(null, '', `?tab=${'dna'}`);
        }
        console.log("newTab : ", newTab)
      });
    }
  }, []);

  const handleTabChange = debounce((event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    if (typeof window !== 'undefined') {
      if (newValue !== value) {
        window.history.pushState(null, '', `?tab=${newValue}`);
      }
    }
  });

  return (
    <>
      <Stack sx={{ height: '100%', pb: `${HEADER.H_MOBILE}px` }}>
        <Stack>
          <CHeader title={'좋아요'} {...options} />
        </Stack>

        <TabContext value={value}>
          <Box sx={{ flex: 1 }}>
            {/* <Stack> */}
            <Tabs
              value={value}
              onChange={handleTabChange}
              variant="fullWidth"
              aria-label="like tabs"
              sx={{
                minHeight: pxToRem(44),
                height: pxToRem(44),
                borderBottom: `.3px solid #EEEEEE`,
                '& .MuiTab-root': {
                  m: '0 !important',
                },
              }}
            >
              <Tab
                label={
                  <span style={{ fontSize: '1rem', fontWeight: value === 'dna' ? 600 : 400 }}>
                    유전자 &nbsp;{' '}
                    <span
                      style={
                        value == 'dna'
                          ? { color: theme.palette.primary.main }
                          : { color: '#BDBDBD' }
                      }
                    >
                      {likeStore.likes.length == 0 ? '' : likeStore.likes.length}
                    </span>
                  </span>
                }
                sx={{
                  width: '50%',
                  '&:not(.Mui-selected)': {
                    color: '#BDBDBD',
                  },
                }}
                value={'dna'}
              />
              <Tab
                label={
                  <span style={{ fontSize: '1rem', fontWeight: value === 'contents' ? 600 : 400 }}>
                    유형 테스트 &nbsp;
                    <span
                      style={
                        value == 'contents'
                          ? { color: theme.palette.primary.main }
                          : { color: '#BDBDBD' }
                      }
                    >
                      {likeStore.contentLikes.length == 0 ? '' : likeStore.contentLikes.length}
                    </span>
                  </span>
                }
                sx={{
                  width: '50%',
                  '&:not(.Mui-selected)': {
                    color: '#BDBDBD',
                  },
                }}
                value={'contents'}
              />
            </Tabs>
            {/* </Stack> */}

            <TabPanel value={'dna'} sx={{ m: 0, p: 2.5 }}>
              {likeStore.likes.length == 0 ? (
                <Stack sx={{ alignItems: 'center', pt: 9 }}>
                  <Image src={'/assets/images/temp/like-test-image.svg'} sx={{ width: '60px' }} />
                  <Typography sx={{ color: '#C6C7CA', mt: 3, fontSize: '1rem' }}>
                    관심 검사를 등록해주세요
                  </Typography>
                </Stack>
              ) : (
                <Box sx={{ flexGrow: 1 }}>
                  <Grid container spacing={2} justifyContent={'space-between'}>
                    {likeStore.likes.map((like: ILikeSnapshot, i: number) => (
                      <Grid key={`like.goodsSid-${i}`} item xs={6} sm={6} md={6}>
                        <LikeDnaItems data={like} />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </TabPanel>

            <TabPanel value={'contents'} sx={{ m: 0, p: 2.5 }}>
              {likeStore.contentLikes.length == 0 ? (
                <Stack sx={{ alignItems: 'center', pt: 9 }}>
                  <Image src={'/assets/images/temp/like-test-image-2.svg'} sx={{ width: '60px' }} />
                  <Typography sx={{ color: '#C6C7CA', mt: 3, fontSize: '1rem' }}>
                    관심 테스트를 등록해주세요
                  </Typography>
                </Stack>
              ) : (
                <Box sx={{ flexGrow: 1 }}>
                  <Grid container spacing={2} justifyContent={'space-between'}>
                    {likeStore.contentLikes.map((contentLike: ILikeSnapshot, i: number) => (
                      <Grid key={`contentLike.contsSid-${i}`} item xs={6} sm={6} md={6}>
                        <LikeTestItems data={contentLike} />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </TabPanel>
          </Box>
        </TabContext>
      </Stack>
    </>
  );
});

export default Like;
