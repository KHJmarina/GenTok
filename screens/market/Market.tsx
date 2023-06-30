import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { SwipeEventData, useSwipeable } from 'react-swipeable';
import { ICategoryModel } from 'src/models/market-store/Category';
import { useStores } from 'src/models/root-store/root-store-context';
import { Page } from '../../components/Page';
import { GoodsList, IGoodsListProps } from './components/GoodsList';
import { IMenubarProps, Menubar } from './components/Menubar';
import { SearchBar } from './components/SearchBar';
import { GoodsMain } from './main/GoodsMain';
import { PackageList } from './package/PackageList';
/**
 * ## Market 설명
 *
 */
export const Market = observer(() => {
  const rootStore = useStores();
  const { marketStore } = rootStore;

  const navigate = useNavigate();
  const { category } = useParams();
  const [categories, setCategories] = useState<ICategoryModel[]>([]);

  useEffect(() => {
    console.log('Market useEffect', category);
    marketStore?.goodsStore.setCategory(parseInt(category || '-1'));
  }, [category, marketStore?.goodsStore]);

  /**
   * 스와이프 이벤트 활성 영역
   * 좌우 30px
   */
  const swipeableEdge = 50;

  /**
   * 스와이프 이벤트 활성 속도
   */
  const swipeableVelocity = 0.3;

  /**
   * # 스와이프 레프트 이벤트 핸들러
   * - 스와이프 속도가 0.3 이상이어야 함
   * - 스와이프 시작 위치가 화면의 우측 30px 이내여야 함
   * @param eventData
   */
  const onSwipedLeft = useCallback(
    (eventData: SwipeEventData) => {
      if (eventData.velocity < swipeableVelocity) {
        return;
      }
      if (eventData.initial[0] < window.innerWidth - swipeableEdge) {
        return;
      }
      const _category = parseInt(category || '-1');
      const tabIndex = categories.findIndex((c) => c.ctegrySid === _category);
      const nextTabIndex = tabIndex === categories.length - 1 ? 0 : tabIndex + 1;
      if (nextTabIndex > 0) {
        navigate('/market/category/' + categories[nextTabIndex].ctegrySid);
      } else {
        // 마켓 메인 화면으로 이동
        navigate('/market');
      }
    },
    [categories, category, navigate],
  );

  /**
   * # 스와이프 라이트 이벤트 핸들러
   * - 스와이프 속도가 0.3 이상이어야 함
   * - 스와이프 시작 위치가 화면의 좌측 30px 이내여야 함
   * @param eventData
   */
  const onSwipedRight = useCallback(
    (eventData: SwipeEventData) => {
      if (eventData.velocity < swipeableVelocity) {
        return;
      }
      if (eventData.initial[0] > swipeableEdge) {
        return;
      }
      const _category = parseInt(category || '-1');
      const tabIndex = categories.findIndex((c) => c.ctegrySid === _category);
      const nextTabIndex = tabIndex === 0 ? categories.length - 1 : tabIndex - 1;

      /* 선택한 카테고리 별 데이터 조회 */
      // -1 이면 메인 화면 데이터 조회 ==> 패키지 데이터 조회로 변경
      // 0 이면 전체 데이터 조회
      // 1 이상이면 해당 카테고리 데이터 조회
      if (nextTabIndex > 1) {
        navigate('/market/category/' + categories[nextTabIndex].ctegrySid);
      } else {
        // 마켓 메인 화면 ==> 패키지 데이터 조회로 변경 - 여기서 변경은 없고 해당 컴포넌트를 교체한다.
        navigate('/market');
      }
    },
    [categories, category, navigate],
  );

  const menubarProps: IMenubarProps = {
    categories: categories,
    category: parseInt(category || '-1'),
    onChangeCategory: (tabIndex) => {
      if (tabIndex) {
        const category = categories[tabIndex];
        navigate('/market/category/' + category.ctegrySid);
      } else {
        navigate('/market');
      }
    },
  };

  const listProps: IGoodsListProps = {
    category,
  };

  useEffect(() => {
    if (marketStore) {
      marketStore.initialize();
      setCategories(marketStore.categoryStore.categoriesForMarket);
    }
  }, [marketStore, marketStore?.categoryStore.list.length]);

  const handlers = useSwipeable({
    delta: 30, // min distance(px) before a swipe starts **default**: `10`
    onSwipedLeft,
    onSwipedRight,
    swipeDuration: 600,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    <Page title="DNA Market" sx={{ p: 0 }}>
      <SearchBar />
      <Menubar {...menubarProps} />
      {/* // TODO GoodsMain => PackageList 로 변경 */}
      {/* <div {...handlers}>{category ? <GoodsList {...listProps} /> : <GoodsMain />}</div> */}
      <div {...handlers}>{category ? <GoodsList {...listProps} /> : <PackageList />}</div>
    </Page>
  );
});

export default Market;
