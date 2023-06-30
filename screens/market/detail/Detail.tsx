import { Divider, Stack, Tabs } from '@mui/material';
import { useScroll } from 'framer-motion';

import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Page } from 'src/components/Page';
import Header from 'src/components/PageHeader';
import { HEADER } from 'src/config-global';
import { IGoodsModel } from 'src/models/market-store/Goods';
import { useStores } from 'src/models/root-store/root-store-context';
import { Announcement } from './Announcement';
import { Comments } from './Comments';
import { Coupon, ICouponProps } from './Coupon';
import { Description } from './Description';
import { Footer, IFooterProps } from './Footer';
import { GoodsInfo, IGoodsInfoProps } from './GoodsInfo';
import { Hero, IHeroProps } from './Hero';
import { Review } from './Review';
import { ISuggestionProps, Suggestion } from './Suggestion';
import { Tab } from './Tab';
import { TabLabel } from './TabLabel';
import { TabPanel } from './TabPanel';
import Image from 'src/components/image/Image';

/**
 * ## Detail 설명
 *
 */
export const Detail = observer(() => {
  const { REACT_APP_IMAGE_STORAGE } = process.env;
  const rootStore = useStores();
  const { marketStore } = rootStore;

  const navigate = useNavigate();
  const { id: goodsSid } = useParams();

  const [goods, setGoods] = useState<IGoodsModel | undefined>(undefined);

  const [selectedTab, setSelectedTab] = useState(0);
  const [showFooter, setShowFooter] = useState(false);
  const [numberOfComments, setNumberOfComments] = useState<number | undefined>();
  const [numberOfReviews, setNumberOfReviews] = useState<number | undefined>();

  // 상품 상세 조회
  useEffect(() => {
    (async () => {
      const _goodsSid = parseInt(goodsSid || '0');
      if (goods && goods.goodsSid === _goodsSid) return;

      await marketStore?.goodsStore?.find(_goodsSid);

      const item = marketStore?.goodsStore?.list?.find((v) => v.goodsSid === _goodsSid);

      if (!item) {
        navigate('/404');
        return;
      }

      setGoods(item);

      marketStore.commentStore.searchByGoods(_goodsSid);
      marketStore.reviewStore.search(_goodsSid);
      marketStore.gameRecommendStore.search();
      marketStore.goodsRecommendStore.search(_goodsSid);
    })();
  }, [marketStore, goodsSid, goods, navigate]);

  useEffect(() => {
    if (goods) {
      setNumberOfComments(marketStore?.commentStore?.pagination?.totalElements);
      setNumberOfReviews(marketStore?.reviewStore.pagination?.totalElements);
    }
  }, [
    goods,
    marketStore?.commentStore?.pagination?.totalElements,
    marketStore?.reviewStore.pagination?.totalElements,
  ]);

  const handleOnChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const { scrollY } = useScroll();
  useEffect(() => {
    scrollY.on('change', (v) => {
      if (v > 50) {
        setShowFooter(true);
      } else {
        setShowFooter(false);
      }
    });
  }, [scrollY]);

  // const [heroHeight, setHeroHeight] = useState(0);

  const heroProps: IHeroProps = {
    goods,
  };

  const goodsInfoProps: IGoodsInfoProps = {
    goods,
  };

  const couponProps: ICouponProps = useMemo(
    () => ({
      data: marketStore.gameRecommendStore.gameRecommendListTop2,
    }),
    [marketStore?.gameRecommendStore.gameRecommendListTop2],
  );

  const suggestionProps: ISuggestionProps = useMemo(
    () => ({ data: marketStore.goodsRecommendStore.goodsRecommendListTop2 }),
    [marketStore.goodsRecommendStore.goodsRecommendListTop2],
  );

  const footerProps: IFooterProps = {
    goods,
    show: showFooter,
  };

  return (
    <>
      <Page
        id="GoodsDetail"
        title={`DNA Market - 상품 상세 : ${goods?.goodsNm}}`}
        sx={{ p: 0, background: 'transparent', flex: 1 }}
        header={
          <Header
            title={`${goods?.goodsNm}`}
            hideTitleAtOffsetTop
            handleClose={() => navigate(-1)}
          />
        }
      >
        <Stack
          direction="column"
          spacing={0}
          sx={{
            flex: 1,
            pb: `${HEADER.H_MOBILE * 2}px`,
            scrollMarginTop: '100px',
            gap: 1,
          }}
        >
          {/* 상품 이미지 */}
          <Hero {...heroProps} />

          {/* 상품 정보 */}
          <GoodsInfo {...goodsInfoProps} />
          <Divider />

          {!goods?.packageYn && (
            <>
              {/* 쿠폰을 받을 수 있는 게임 */}
              <Coupon {...couponProps} />
              <Divider />
            </>
          )}

          <Stack
            direction="column"
            spacing={0}
            sx={{
              gap: 1,
              background: '#fff',
            }}
          >
            <Tabs
              value={selectedTab}
              onChange={handleOnChangeTab}
              variant="fullWidth"
              aria-label=""
              sx={{
                boxSizing: 'border-box',
                '& .MuiTabs-flexContainer ': {
                  borderBottom: '1px solid #eeeeee',
                },
                '& .MuiTab-root': {
                  flex: 1,
                  margin: '0 !important',
                },
              }}
            >
              <Tab label={<TabLabel label="상품 설명" selected={selectedTab === 0} />} />
              <Tab
                label={
                  <TabLabel label="댓글" count={numberOfComments} selected={selectedTab === 1} />
                }
              />
              <Tab
                label={
                  <TabLabel label="리뷰" count={numberOfReviews} selected={selectedTab === 2} />
                }
              />
            </Tabs>

            {/* 상품 설명 */}
            <TabPanel value={selectedTab} index={0}>
              {goods?.packageYn ? (
                <>
                  {goods?.goodsDescrImgPaths != null && goods.goodsDescrImgPaths.map((v, i) => (
                    <Image
                      key={`${goods.goodsSid}_description_image_${i}`}
                      src={`${REACT_APP_IMAGE_STORAGE}${v}`}
                      alt="패키지 상품 상세"
                    />
                  ))}
                </>
              ) : (
                <Description goods={goods} />
              )}
            </TabPanel>

            {/* 댓글 */}
            <TabPanel value={selectedTab} index={1}>
              <Comments goodsSid={goodsSid} />
            </TabPanel>

            {/* 리뷰 */}
            <TabPanel value={selectedTab} index={2}>
              <Review goodsSid={goodsSid} />
            </TabPanel>
          </Stack>

          <Divider />

          {/* 추천 유전자 */}
          {!goods?.packageYn && (
            <>
              <Suggestion {...suggestionProps} />
              <Divider />
            </>
          )}

          {/* 안내 */}
          <Announcement />
        </Stack>

        <Footer {...footerProps} />
      </Page>
    </>
  );
});

export default Detail;

