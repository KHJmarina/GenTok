import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router';
import { IGoodsModel } from 'src/models/market-store/Goods';

import { IPackageItemViewProps, PackageItemView } from './PackageItemView';

export interface IPackageItemProps {
  data: IGoodsModel;
  onClick: () => void;
}

export const PackageItem = observer(({ data, onClick }: IPackageItemProps) => {
  const navigate = useNavigate();

  const handleOnClick = () => {
    navigate(`/market/goods/${data.goodsSid}`);
  };

  const viewProps: IPackageItemViewProps = {
    data,
    onClick: handleOnClick,
  };
  return <PackageItemView {...viewProps} />;
});
