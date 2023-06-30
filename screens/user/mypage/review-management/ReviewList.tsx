import { TabContext, TabPanel } from '@mui/lab';
import { Box, Stack, Tab, Tabs, useTheme } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { CHeader } from 'src/components/CHeader';
import { useStores } from 'src/models/root-store/root-store-context';
import PossibleReviewItem from './review-list-items/PossibleReviewItem';
import ReviewItem from './review-list-items/ReviewItem';
import { CallApiToStore } from 'src/utils/common';
import { pxToRem } from 'src/theme/typography';
import { HEADER, SPACING } from 'src/config-global';
import { PATH_ROOT } from 'src/routes/paths';

/**
 * ## ReviewList 설명
 *
 */

const ReviewList = observer(() => {
  const rootStore = useStores();
  const { loadingStore, myReviewStore, responseStore } = rootStore;
  const theme = useTheme();

  const navigate = useNavigate();
  const possibleReviewRef = useRef<HTMLSpanElement>(null);
  const myReviewRef = useRef<HTMLSpanElement>(null);
  // const { tab } = useParams();

  const searchParams = new URLSearchParams(document.location.search);
  const tabName = searchParams.get('tab') || 'possibleReview';

  // const [value, setValue] = useState(tab ? tab : 'possibleReview' );
  const [value, setValue] = useState(tabName);

  // const handleChange = (event: React.SyntheticEvent, newValue: string) => {
  //   setValue(newValue);
  // };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    // console.log(newValue)
    if (typeof window !== 'undefined') {
      if (newValue !== value) {
        window.history.pushState(null, '', `?tab=${newValue}`);
      }
    }
  };

  const getDatas = async () => {
    // 작성 가능한 리뷰 목록 조회
    CallApiToStore(myReviewStore.getPossibles({ page: 1 }), 'api', loadingStore)
      .then(() => {})
      .catch((e) => {
        console.log(e);
      });

    // 작성한 리뷰 목록 조회
    CallApiToStore(myReviewStore.gets({ page: 1 }), 'api', loadingStore)
      .then(() => {})
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    getDatas();
  }, []);

  useEffect(() => {
    window.history.pushState(null, '', `?tab=${'possibleReview'}`);

    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', () => {
        const params = new URLSearchParams(window.location.search);
        const newTab = params.get('tab');
        if (newTab) {
          setValue(newTab);
        }
        if (newTab == null) {
          navigate(PATH_ROOT.user.mypage.main);
        }
      });
    }
  }, []);

  const options: any = {
    showMainIcon: 'back',
    handleMainIcon: () => {
      navigate(PATH_ROOT.user.mypage.main);
    },
    showHomeIcon: true,
  };

  return (
    <Stack>
      <CHeader title="리뷰" {...options} />

      <TabContext value={value}>
        <Stack>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="fullWidth"
            aria-label="find id tabs"
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
                <span
                  style={{
                    fontSize: pxToRem(16),
                    fontWeight: value === 'possibleReview' ? 600 : 400,
                  }}
                >
                  작성 가능한 리뷰 &nbsp;
                  <span
                    ref={possibleReviewRef}
                    style={
                      value === 'possibleReview'
                        ? { color: theme.palette.primary.main }
                        : { color: '#BDBDBD' }
                    }
                  >
                    {myReviewStore.paginationByPsl.totalElements === 0
                      ? ''
                      : myReviewStore.paginationByPsl.totalElements}
                  </span>
                </span>
              }
              sx={{
                width: '50%',
                '&:not(.Mui-selected)': {
                  color: '#BDBDBD',
                },
              }}
              value={'possibleReview'}
            />

            <Tab
              label={
                <span
                  style={{ fontSize: pxToRem(16), fontWeight: value === 'myReview' ? 600 : 400 }}
                >
                  내 리뷰 &nbsp;
                  <span
                    ref={myReviewRef}
                    style={
                      value === 'myReview'
                        ? { color: theme.palette.primary.main, fontWeight: 600 }
                        : { color: '#BDBDBD' }
                    }
                  >
                    {myReviewStore.pagination.totalElements === 0
                      ? ''
                      : myReviewStore.pagination.totalElements}
                  </span>
                </span>
              }
              sx={{
                width: '50%',
                '&:not(.Mui-selected)': {
                  color: '#BDBDBD',
                },
              }}
              value={'myReview'}
            />
          </Tabs>
        </Stack>
        <TabPanel value={'possibleReview'} sx={{ p: 0 }}>
          <PossibleReviewItem setValue={setValue} />
        </TabPanel>

        <TabPanel value={'myReview'} sx={{ p: 0 }}>
          <ReviewItem />
        </TabPanel>
      </TabContext>
    </Stack>
  );
});

export default ReviewList;
