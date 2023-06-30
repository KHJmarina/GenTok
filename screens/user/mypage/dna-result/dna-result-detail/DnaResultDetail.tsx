import Box from '@mui/material/Box';
import { Stack, useTheme } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from '../../../../../models/root-store/root-store-context';
import { pxToRem } from 'src/theme/typography';
import { DnaCardPopular } from 'src/screens/user/mypage/dna-result/dna-result-detail/detail-card/DnaCardPopular';
import { ReactComponent as IconTop } from 'src/assets/icons/ico-top.svg';
import { GenoData } from '../dna-result-detail/detail-card/GenoData';
import { GenoRate } from '../dna-result-detail/detail-card/GenoRate';
import { DnaCardNotice } from '../dna-result-detail/detail-card/DnaCardNotice';
import { DnaTestResult } from '../dna-result-detail/detail-card/DnaTestResult';
import { DnaCardChart } from '../dna-result-detail/detail-card/DnaCardChart';
import { DnaCardSurvey } from '../dna-result-detail/detail-card/DnaCardSurvey';

/**
 * ## DnaResultDetail 설명
 *
 */
export const DnaResultDetail = observer(() => {
  const rootStore = useStores();
  const { dnaCardDetailStore, loadingStore } = rootStore;
  const theme = useTheme();
  const [pageY, setPageY] = useState<number>(0);
  const [isShown, setIsShown] = useState<boolean>(false); // 버튼 상태

  const handleScroll = () => {
    setPageY(window.scrollY);

    if (window.scrollY > 786) {
      setIsShown(true);
    } else {
      setIsShown(false);
    }
  };

  useEffect(() => {
    // console.log('scrollY : ', pageY);
    // console.log(isShown);
  }, [pageY]);

  useEffect(() => {
    window.removeEventListener('scroll', handleScroll);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <Stack
        sx={{
          // mb: 3,
          mt: pxToRem(40),
        }}
      >
        <DnaTestResult />
        <GenoRate />
        <DnaCardPopular />
        <DnaCardChart />
        <DnaCardSurvey />
        <GenoData />
        <DnaCardNotice />

        {isShown == true ? (
          <IconTop
            style={{
              position: 'fixed',
              right: pxToRem(16),
              bottom: pxToRem(13),
            }}
            onClick={() =>
              window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth',
              })
            }
          />
        ) : (
          ''
        )}
      </Stack>
    </>
  );
});

export default DnaResultDetail;
