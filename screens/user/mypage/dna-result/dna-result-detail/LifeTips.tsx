import Box from '@mui/material/Box';
import {
  Stack,
  useTheme,
  Typography,
  List,
  ListItem,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { useStores } from '../../../../../models/root-store/root-store-context';
import { useAuthContext } from 'src/auth/useAuthContext';
import { pxToRem } from 'src/theme/typography';
import Iconify from 'src/components/iconify';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ReactComponent as IconSolution1 } from 'src/assets/icons/ico-solution-1.svg';
import { ReactComponent as IconSolution2 } from 'src/assets/icons/ico-solution-2.svg';
import { ReactComponent as IconSolution3 } from 'src/assets/icons/ico-solution-3.svg';
import { ReactComponent as IconTop } from 'src/assets/icons/ico-top.svg';
const { REACT_APP_IMAGE_STORAGE } = process.env;
/**
 * ## LifeTips 설명
 *
 */
const useStyles = makeStyles(() => ({
  accordion: {
    '& .Mui-expanded': {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '0',
    },
    '& .css-o4b71y-MuiAccordionSummary-content': {
      alignItems: 'center',
    },
    '& .css-1nevnd3-MuiPaper-root-MuiAccordion-root:before': {
      display: 'none',
      border: 'none',
      position: 'none',
    },
    
  },
}));

export const LifeTips = observer(() => {
  const rootStore = useStores();
  const { dnaCardDetailStore, loadingStore } = rootStore;
  const theme = useTheme();
  const { user, isAuthenticated } = useAuthContext();
  const classes = useStyles();
  const [accdn, setAccdn] = useState<boolean>(true);
  const [pageY, setPageY] = useState<number>(0);
  const [isShown, setIsShown] = useState<boolean>(false); // 버튼 상태
  const tips = dnaCardDetailStore.dnaCardDetail
    ? JSON.parse(dnaCardDetailStore.dnaCardDetail?.tips!)
    : '';
  const [isRender, setIsRender] = useState<boolean>(false);
  const handleChange = (event: React.SyntheticEvent) => {
    setAccdn(!accdn);
  };

  const handleScroll = () => {
    setPageY(window.scrollY);

    if (window.scrollY > 250) {
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

  useEffect(() => {
    // const tips = dnaCardDetailStore.dnaCardDetail ?  JSON.parse(dnaCardDetailStore.dnaCardDetail?.tips!) : ''
    if (tips.length > 0) {
      setIsRender(true);
    } else {
      setIsRender(false);
    }
    // console.log('>>> ', tips);
    // console.log(dnaCardDetailStore.dnaCardDetail?.nutrientList!.length);
  }, []);

  const getSolutionIcon = (index: number) => {
    switch(index) {
      case 0 :
        return <IconSolution1 width={'2rem'} height={'2rem'} />;
      case 1 :
        return <IconSolution2 width={'2rem'} height={'2rem'} />;
      case 2 :
        return <IconSolution3 width={'2rem'} height={'2rem'} />;
      default :
        return;
    }
  }

  return (
    <>
      {isRender && (
        <>
          <Box sx={{ mb: 3, p: 2.5 }}>
            <Typography
              variant={'h5'}
              sx={{
                textAlign: 'left',
                mb: pxToRem(20),
                mt: 2,
                fontSize: pxToRem(22),
                fontWeight: '600',
              }}
            >
              당신을 위한 생활관리 솔루션
            </Typography>

            {tips.map((tip: any, index: number) => {
              return (
                <Accordion
                  key={index}
                  defaultExpanded={index === 0 ? true : false}
                  onClick={handleChange}
                  sx={{
                    border: '1px solid #EEEEEE',
                    borderRadius: pxToRem(10),
                    mb: '1rem',
                    '&.MuiAccordion-root.Mui-expanded': {
                      boxShadow: 'none',
                      mt: 0,
                    },
                    '&.MuiAccordion-root.Mui-expanded:before': {
                      opacity: 1,
                    },
                    
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: '#DFE0E2'}} />}
                    sx={{ height: '3.75rem', pr: '1rem', '.MuiAccordionSummary-content': { m: 0 } }}
                    className={classes.accordion}
                  >
                    {tip.imgPath ? (
                      <Box
                        component={'img'}
                        src={`${REACT_APP_IMAGE_STORAGE}${tip.imgPath}` || ''}
                        width={'2rem'}
                        height={'2rem'}
                      />
                    ) : (
                      getSolutionIcon(index)
                    )}

                    <Typography sx={{ pl: '0.5rem', fontSize: '1.13rem', lineHeight: pxToRem(26), textAlign: 'left' }}>
                      {tip.title}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{
                      fontSize: '1rem',
                      fontWeight: '0.06rem',
                      textAlign: 'left',
                      pt: pxToRem(0),
                      px: pxToRem(20),
                    }}
                  >
                    {tip.contents}
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Box>
          {dnaCardDetailStore.dnaCardDetail?.nutrientList!.length > 0 &&
            <Divider sx={{ borderWidth: '0.5rem' }}></Divider>
          }

          {/* 없는 경우 노출X */}
          <Box sx={{ pl: '1.25rem' }}>
            {dnaCardDetailStore.dnaCardDetail?.nutrientList!.length > 0 ? (
              <Box>
                <Typography
                  variant={'h5'}
                  sx={{
                    textAlign: 'left',
                    pt: '2.5rem',
                    pb: '0.625rem',
                    fontSize: pxToRem(22),
                    fontWeight: '600',
                  }}
                >
                  추천 영양소 및 기능성 원료
                </Typography>
                {dnaCardDetailStore.dnaCardDetail.nutrientList?.map((list: any, index: number) => {
                  return (
                    <List sx={{ listStyleType: 'disc', pl: '1.25rem' }}>
                      <ListItem
                        sx={{
                          display: 'list-item',
                          p: 0,
                          pb: 1,
                          fontSize: pxToRem(14),
                          mb: '2.5rem',
                        }}
                      >
                        {list}
                      </ListItem>
                    </List>
                  );
                })}
              </Box>
            ) : null}

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
          </Box>
        </>
      )}
    </>
  );
});

export default LifeTips;
