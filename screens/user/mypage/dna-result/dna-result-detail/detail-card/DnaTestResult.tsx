import Box from '@mui/material/Box';
import {
  Stack,
  useTheme,
  Typography,
  Card,
  List,
  ListItem,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
} from '@mui/material';
import { useAuthContext } from 'src/auth/useAuthContext';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from '../../../../../../models/root-store/root-store-context';
import { ReactComponent as IconCoin } from 'src/assets/icons/ico-coin.svg';
import { pxToRem } from 'src/theme/typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ReactComponent as IconGenotypeCandy } from 'src/assets/icons/ico-genotype-candy.svg';
import { toJS } from 'mobx';
/**
 * ## GenoData 설명
 *
 */
export const DnaTestResult = observer(() => {
  const rootStore = useStores();
  const { dnaCardDetailStore, loadingStore } = rootStore;
  const theme = useTheme();
  const { user, isAuthenticated } = useAuthContext();
  const [checkValue, setCheckValue] = useState('');
  const [pageY, setPageY] = useState<number>(0);
  const [isShown, setIsShown] = useState<boolean>(false); // 버튼 상태
  const [accdn, setAccdn] = useState<boolean>(true);
  const [testResultDesctTitle, setTestResultDesctTitle] = useState<any>();
  const [subContents, setSubContents] = useState<any>();
  const [contents, setContents] = useState<any>();
  const [ctegryName, setCtegryName] = useState<any>();
  const [isRender, setIsRender] = useState<boolean>(false);

  const testResultDescr = dnaCardDetailStore.dnaCardDetail
    ? JSON.parse(dnaCardDetailStore.dnaCardDetail?.testResultDescr!)
    : '';

  const handleChange = (event: React.SyntheticEvent) => {
    setAccdn(!accdn);
  };
  useEffect(() => {

    // console.log(JSON.parse(dnaCardDetailStore.dnaCardDetail?.testResultDescr!));
    // console.log('testResultDescr : ', testResultDescr);

    if (testResultDescr.length > 0) {
      setIsRender(true);
    } else {
      setIsRender(false);
    }
  }, []);

  return (
    <>
    {isRender &&(
      <>
      {testResultDescr.map((descr: any, index: number) => {
        return (
          <Box key={descr} sx={{ px: pxToRem(19.5) }}>
            <Typography
              sx={{
                color: '#202123',
                fontWeight: 600,
                fontSize: pxToRem(22),
                textAlign: 'left',
                lineHeight: pxToRem(30),
              }}
            >
              { descr.title.includes('nickNm') ? 
                descr.title
                  .replace(/__nickNm__ /gi, user?.nickNm ? user?.nickNm : (user?.userNm || ''))
                  .split('님은', 2)[0]
                  
                : '-'
              }
              님의 <br />
            </Typography>
            <Typography
              sx={{
                color: '#202123',
                fontWeight: 600,
                fontSize: pxToRem(22),
                textAlign: 'left',
                mb: pxToRem(12),
                lineHeight: pxToRem(30),
              }}
            >
              {dnaCardDetailStore.dnaCardDetail?.goodsNm} 유전적 능력치는 <br />
              
              <span style={{ color: theme.palette.primary.main }}>
                {dnaCardDetailStore.dnaCardDetail?.testResultNm} 
                {dnaCardDetailStore.dnaCardDetail?.level?.myLevel == 0 ? '' : dnaCardDetailStore.dnaCardDetail?.level?.myLevel + `단계` }
              </span>
              &nbsp;입니다
            
            </Typography>
            <Typography sx={{ textAlign: 'left', color: '#5D6066' }}>
              {descr.subContents}
            </Typography>
            {descr.contents.map((contents: any, i: number) => {
              return (
                <List
                  key={contents}
                  sx={{
                    listStyleType: 'disc',
                    pl: 2,
                    fontSize: pxToRem(16),
                    fontWeight: 400,
                    color: '#5D6066',
                  }}
                >
                  <ListItem sx={{ display: 'list-item', p: 0 }}>{contents}</ListItem>
                </List>
              );
            })}
            {dnaCardDetailStore.dnaCardDetail.geno?.genoRateStr ?
              <List
                    key={contents}
                    sx={{
                      listStyleType: 'disc',
                      pl: 2,
                      fontSize: pxToRem(16),
                      fontWeight: 400,
                      color: '#5D6066',
                    }}
                  >
                    <ListItem sx={{ display: 'list-item', p: 0 }}>
                      {
                      dnaCardDetailStore.dnaCardDetail.geno.genoRateDescr?.replace(/__goodsNm__/gi, dnaCardDetailStore.dnaCardDetail?.goodsNm!)
                      .replace(/__genoRateStr__/gi,dnaCardDetailStore.dnaCardDetail?.geno?.genoRateStr!)
                      } 
                    </ListItem>
              </List>
            : null}
          </Box>
        );
      })}
      <Divider sx={{ borderWidth: 6, pl: `0!important`, mt: pxToRem(40) }}></Divider>
      </>
      )}
      </>
  );
});

export default DnaTestResult;
