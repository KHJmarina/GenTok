import { observer } from 'mobx-react-lite';
import { IGoodsModel } from 'src/models/market-store/Goods';
import { GoodsListItemView, IGoodsListItemViewProps } from './GoodsListItem.view';

export interface IGoodsListItemProps {
  data: IGoodsModel;
  listType: 'grid' | 'list';
  onClick: (data: IGoodsModel) => void;
  onToggle: (data: IGoodsModel) => void;
  toggleCart: (data: IGoodsModel) => void;
}

export const GoodsListItem = observer(
  ({ data, listType, toggleCart, onClick, onToggle }: IGoodsListItemProps) => {
    /**
     * 장바구니(카트)를 클릭했을 때
     */
    const handleOnToggleCart = () => {
      toggleCart(data);
    };

    /**
     * 상품 상세를 보기 위해서 상품을 클릭했을 때
     */
    const handleOnClick = () => {
      onClick(data);
    };

    /**
     * 상품을 선택했을 때 (체크박스)
     */
    const handleOnToggle = () => {
      onToggle(data);
    };

    const viewProps: IGoodsListItemViewProps = {
      data: data,
      listType,
      onToggleCart: handleOnToggleCart,
      onClick: handleOnClick,
      onToggle: handleOnToggle,
    };

    return <GoodsListItemView {...viewProps} />;
  },
);
