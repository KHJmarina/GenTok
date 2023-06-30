import { Typography, Stack, Chip, Divider, Button, Link, Fade } from '@mui/material';
import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import {
  useTheme,
  Accordion as MuiAccrodion,
  AccordionDetails as MuiAccordionDetails,
  AccordionSummary as MuiAccordionSummary,
  styled,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { pxToRem } from 'src/theme/typography';
import guide_01 from '../../../assets/images/guide_01.svg';
import guide_game from '../../../assets/images/guide_game.svg';
import guide_02 from '../../../assets/images/guide_02.svg';
import guide_face from '../../../assets/images/guide_face.svg';
import guide_03 from '../../../assets/images/guide_03.svg';
import guide_04 from '../../../assets/images/guide_04.svg';
import guide_05 from '../../../assets/images/guide_05.svg';
import guide_06 from '../../../assets/images/guide_06.svg';
import { ReactComponent as IcoHome } from 'src/assets/icons/ico-home.svg';
import { ReactComponent as IcoCart } from 'src/assets/icons/ico-cart.svg';
import { ReactComponent as ExpandMoreIcon } from 'src/assets/icons/ico-expand-more.svg';
import { ReactComponent as IconBack } from 'src/assets/icons/ico-back.svg';
import { PATH_ROOT } from '../../../routes/paths';
import { useScroll } from 'framer-motion';
import Icon from 'src/components/color-utils/Icon';
import Iconify from 'src/components/iconify';
import CHeader from 'src/components/CHeader';
import Image from 'src/components/image';

/**
 * ## 기능 설명
 *
 * 이 페이지에 구현된 기능을 설명하시오.
 *
 */

const Accordion = styled(MuiAccrodion)(({ theme }) => ({
  '&.MuiAccordion-root': {
    border: '1px solid #eeeeee',
    borderRadius: pxToRem(10),
    backgroundColor: '#FAFAFA',
    '&:before': {
      display: 'none',
    },
    minHeight: '52px',
    '&.Mui-expanded': {
      boxShadow: 'none',
      borderRadius: pxToRem(10),
      minHeight: '52px',
      p: pxToRem(10),
    },
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  '&.MuiAccordionDetails-root': {
    p: pxToRem(20),
    textAlign: 'left',
    borderRadius: pxToRem(10),
    backgroundColor: '#FAFAFA',
    fontWeight: 400,
    lineHeight: 22 / 14,
    fontSize: pxToRem(14),
  },
}));

const AccordionSummary = styled(MuiAccordionSummary)(({ theme }) => ({
  '&.MuiAccordionSummary-root': {
    color: '#202123',
    fontWeight: 400,
    lineHeight: 24 / 16,
    fontSize: pxToRem(16),
    minHeight: '52px',
    p: pxToRem(20),
    borderRadius: pxToRem(10),
    margin: '0',
    '&.Mui-expanded': {
      borderRadius: pxToRem(10),
      minHeight: '52px',
      margin: '0',
    },
    '& .MuiAccordionSummary-content': {
      '&.Mui-expanded': {
        m: pxToRem(10),
      },
    },
  },
}));
export const Guide = observer(() => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [expanded, setExpanded] = React.useState<string | false>('panel3');

  const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, newExpanded: boolean) => {
    setExpanded(newExpanded ? panel : false);
  };

  const { scrollY } = useScroll();
  const [showHeader, setShowHeader] = useState(false);
  useEffect(() => {
    scrollY.on('change', (v) => {
      if (v > 70) {
        setShowHeader(true);
      } else {
        setShowHeader(false);
      }
    });
  }, [scrollY]);
  const options: any = {
    showMainIcon: 'back',
    showHomeIcon: true,
    showCartIcon: true,
  };

  return (
    <>
      <Stack
        sx={{
          maxWidth: '100%',
        }}
      >
        <Stack sx={{ mb: pxToRem(10) }}>
        <CHeader {...options} />
          {showHeader && (
            <Fade in={showHeader} timeout={{ enter: 600, exit: 600 }}>
              <Typography
                p={0}
                sx={{
                  color: showHeader ? theme.palette.common.black : theme.palette.common.white,
                  p: pxToRem(20),
                  position: 'fixed',
                  top: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  alignItems: 'center',
                  minWdith: 'md',
                  mx: 'auto',
                  zIndex: 2,
                  height: '64px',
                  fontWeight: 500,
                  fontSize: pxToRem(20),
                  lineHeight: pxToRem(24),
                }}
              >
                이용가이드
              </Typography>
            </Fade>
          )}
        </Stack>
        <Stack
          sx={{
            px: pxToRem(26),
            pb: pxToRem(40),
            textAlign: 'left',
            borderBottom: theme.palette.grey[500],
            position: 'relative',
          }}
        >
          <Typography variant="Eng_30_r">
            {' '}
            유전자의 모든 것을 <br />
            젠톡하세요
          </Typography>
          <Typography variant="Eng_18_r" sx={{ mt: pxToRem(15), color: theme.palette.grey[500] }}>
            서비스 이용 방법, 간단해요!
          </Typography>
        </Stack>
        <Divider sx={{ borderBottomWidth: pxToRem(1), bgcolor: theme.palette.action.hover }} />

        <Stack sx={{ py: pxToRem(40), px: pxToRem(27), textAlign: 'left' }}>
          {/* 01. 유전자 상품 담아 결제하기 */}
          <Stack>
            <Typography variant="Kor_18_b">
              <span style={{ color: theme.palette.primary.main, marginRight: '5px' }}>01</span> 유전자
              상품 담아 결제하기
            </Typography>
            <Typography variant="Eng_14_r" sx={{ mt: pxToRem(8), color: theme.palette.grey[500] }}>
              마켓에서 알고 싶은 유전자 항목을 담아 구매해 주세요.
            </Typography>
            <Stack
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                mt: pxToRem(25),
              }}
            >
              <Box component={'img'} src={guide_01} width={'100%'} />
            </Stack>
          </Stack>

          <Divider
            sx={{
              borderBottomWidth: pxToRem(0.3),
              bgcolor: theme.palette.grey[900],
              my: pxToRem(40),
            }}
          />

          {/* 02.키트 받고 검사 신청서 작성하기 */}
          <Stack>
            <Typography variant="Kor_18_b">
              <span style={{ color: theme.palette.primary.main, marginRight: '5px' }}>02</span> 키트
              받고 검사 신청서 작성하기
            </Typography>
            <Typography
              variant="Eng_14_r"
              sx={{
                mt: pxToRem(8),
                color: theme.palette.grey[500],
                wordBreak: 'keep-all',
                wordWrap: 'break-word',
              }}
            >
              키트 구성품 내 리플릿의 QR코드를 통해 유전자 검사 신청서와 데이터 보관 및 추가 분석 동의서를 작성합니다.
            </Typography>
            <Stack
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                mt: pxToRem(25),
              }}
            >
              <Box component={'img'} src={guide_02} width={'100%'} />{' '}
              <Box
                sx={{
                  textAlign: 'left',
                  mt: pxToRem(25),
                  borderRadius: pxToRem(10),
                  border: `1px solid #eeeeee`,
                  px: pxToRem(20),
                  pt: pxToRem(20),
                  pb: pxToRem(40),
                }}
              >
                <Typography variant="Kor_16_b" sx={{ color: '#69CA90' }}>
                  Check!
                </Typography>
                <Box sx={{ display: 'flex', mt: pxToRem(3), mb: pxToRem(11), alignItems:'center' }}>
                    <Typography sx={{ mr: pxToRem(5) }} variant='Kor_18_b'>데이터 보관 및 추가 분석에<br/> 동의하면 좋은 점 🤔</Typography>
                </Box>
                <Typography
                  variant="Kor_14_r"
                  color={theme.palette.grey[500]}
                  sx={{
                    mt: pxToRem(12),
                    wordBreak: 'keep-all',
                    wordWrap: 'break-word',
                  }}
                >
                  유전자 검사 신청 시 ’데이터 보관 및 추가 분석’ 약관에 동의하면 유전자 분석 기관인 마크로젠이 나의 유전자 데이터를 안전하게 보관해요.
                  <br />
                </Typography>
                <Box sx={{ mt: pxToRem(10) }}>
                  <Typography
                    variant="Kor_14_r"
                    color={theme.palette.grey[500]}
                    sx={{ mt: pxToRem(10), wordBreak: 'keep-all', wordWrap: 'break-word' }}
                  >
                    따라서 젠톡 서비스를 재이용 할 때는 유전자 분석
                    <span style={{ color: theme.palette.primary.main, fontWeight: 600 }}>
                    {' '}키트를 구매하지 않고 샘플 채취 과정 없이 빠르게 결과를 확인
                    </span>
                    할 수 있습니다. 데이터 보관 약관에 동의하여 다양한 혜택을 놓치지 마세요!
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Stack>

          <Divider
            sx={{
              borderBottomWidth: pxToRem(0.3),
              bgcolor: theme.palette.grey[900],
              my: pxToRem(40),
            }}
          />

          {/* 03.키트에 침 담고 보존액 채우기 */}
          <Stack>
            <Typography variant="Kor_18_b">
              <span style={{ color: theme.palette.primary.main, marginRight: '5px' }}>03</span>{' '}
              키트에 침 담고 보존액 채우기
            </Typography>
            <Typography
              variant="Eng_14_r"
              sx={{
                mt: pxToRem(8),
                color: theme.palette.grey[500],
                wordBreak: 'keep-all',
                wordWrap: 'break-word',
              }}
            >
              거품과 가래를 제외한 침을 빨간색 표시선까지 담아주세요. 깔대기 제거 후, 뚜껑 닫고 5초간 힘차게 섞어주세요.
            </Typography>
            <Link
              sx={{
                textAlign: 'left',
                color: theme.palette.primary.main,
                textDecoration: 'underline',
                my: pxToRem(10),
                fontWeight: 400, lineHeight: 18 / 14, fontSize: pxToRem(14), letterSpacing: '-0.01em', wordBreak: 'keep-all',
                cursor: 'pointer',
              }}
              onClick={() => {
                navigate('/customer/kitGuide');
              }}
            >
              키트 사용법 자세히 보기
            </Link>
            <Stack
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                mt: pxToRem(25),
              }}
            >
              <Box component={'img'} src={guide_03} width={'100%'} />
            </Stack>
            <Stack justifyContent={'center'}></Stack>
          </Stack>

          <Divider
            sx={{
              borderBottomWidth: pxToRem(0.3),
              my: pxToRem(40),
            }}
          />

          {/* 04.반송용 봉투에 넣고 반송 스티커 붙이기 */}
          <Stack sx={{ borderBottom: theme.palette.action.hover }}>
            <Typography variant="Kor_18_b">
              <span style={{ color: theme.palette.primary.main, marginRight: '5px' }}>04</span>{' '}
              반송용 봉투에 넣고 반송 스티커 붙이기
            </Typography>
            <Typography variant="Eng_14_r" sx={{ mt: pxToRem(8), color: theme.palette.grey[500] }}>
              키트를 반송용 봉투에 담아 밀봉해주세요.
            </Typography>
            <Typography variant="Eng_14_r" sx={{ color: theme.palette.grey[500] }}>
              실온상태를 유지해주세요.
            </Typography>
            <Stack sx={{ display: 'flex', flexDirection: 'row', mt: pxToRem(8) }}>
              {['냉장 X', '냉동 X', '가열 X'].map((row: string, i: number) => {
                return (
                  <Chip
                    key={`chip-${i}`}
                    label={row}
                    size={'small'}
                    variant="outlined"
                    sx={{
                      py: pxToRem(2),
                      px: pxToRem(3),
                      color: theme.palette.grey[500],
                      mr: pxToRem(3),
                    }}
                  />
                );
              })}
            </Stack>
            <Stack
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                mt: pxToRem(25),
              }}
            >
              <Box component={'img'} src={guide_04} width={'100%'} />
            </Stack>
          </Stack>

          <Divider
            sx={{
              borderBottomWidth: pxToRem(0.3),
              my: pxToRem(40),
            }}
          />

          {/* 05. 자동 반송 접수하기*/}
          <Stack>
            <Typography variant="Kor_18_b">
              <span style={{ color: theme.palette.primary.main, marginRight: '5px' }}>05</span> 자동
              반송 접수하기
            </Typography>
            <Typography
              variant="Eng_14_r"
              sx={{
                mt: pxToRem(8),
                color: theme.palette.grey[500],
                wordBreak: 'keep-all',
                wordWrap: 'break-word',
              }}
            >
              젠톡{' '}
              <span style={{ color: theme.palette.primary.main, fontWeight: 700 }}>
                주문내역 페이지
              </span>
              에서 반송 신청을 해주세요.
            </Typography>
            <Stack
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                mt: pxToRem(25),
              }}
            >
              <Box component={'img'} src={guide_05} width={'100%'} />
            </Stack>
          </Stack>

          <Divider
            sx={{
              borderBottomWidth: pxToRem(0.3),
              bgcolor: theme.palette.grey[900],
              my: pxToRem(40),
            }}
          />

          {/* 06. 10일 후, 캔비에서 결과 확인하기! */}
          <Stack>
            <Typography variant="Kor_18_b">
              <span style={{ color: theme.palette.primary.main, marginRight: '5px' }}>06</span>
              10일 후 젠톡에서 결과 확인하기!
            </Typography>
            <Typography
              variant="Eng_14_r"
              sx={{
                mt: pxToRem(8),
                color: theme.palette.grey[500],
                wordBreak: 'keep-all',
                wordWrap: 'break-word',
              }}
            >
              유전자 분석은 키트 접수일로부터{' '}
              <span style={{ color: theme.palette.primary.main, fontWeight: 700 }}>10일</span>
              &nbsp; 소요되며, <br/>분석이 완료되면 안내해 드려요.
            </Typography>
            <Stack
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                mt: pxToRem(25),
              }}
            >
              <Box component={'img'} src={guide_06} width={'100%'} />
            </Stack>
          </Stack>

          <Button
            variant={'contained'}
            size={'large'}
            sx={{
              borderRadius: pxToRem(50),
              mt: pxToRem(40),
              mb: pxToRem(20),
              fontWeight: 600,
              lineHeight: 30 / 22,
              fontSize: pxToRem(22),
              letterSpacing: '-0.03em',
            }}
            onClick={() => {
              localStorage.removeItem('navOpen');
              navigate(PATH_ROOT.market.root);
            }}
          >
            젠톡 둘러보기
          </Button>
        </Stack>

        <Box
          sx={{
            maxWidth: 'md',
            width: '100%',
            position: 'fixed',
            bottom: '3%',
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'right',
            pr: pxToRem(20),
            margin: 'auto',
            zIndex: 3,
            backgroundColor: 'transparent',
          }}
        >
          <Fade in={showHeader} timeout={{ enter: 600, exit: 600 }}>
            <Box
              sx={{
                display: showHeader ? 'block' : 'none',
                borderRadius: 5,
                bgcolor: '#ffffff',
                color: theme.palette.common.black,
                boxShadow: '3px 3px 15px rgba(0, 0, 0, 0.1)',
                width: 50,
                height: 50,
              }}
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <Iconify
                icon={'material-symbols:arrow-upward-rounded'}
                sx={{ mt: 1.5, width: 25, height: 25 }}
              />
            </Box>
          </Fade>
        </Box>

        {/* <Stack
          sx={{ p: pxToRem(20), pb: pxToRem(100), backgroundColor: '#FAFAFA', textAlign: 'left' }}
        >
          <Typography variant="Kor_18_b" sx={{ my: pxToRem(15) }}>
            유의사항
          </Typography>
          <Accordion
            square
            expanded={expanded === 'panel1'}
            onChange={handleChange('panel1')}
            sx={{
              mt: pxToRem(8),
              p: 0,
              boxShadow: 'none',
              borderColor: '#000000',
            }}
          >
            <AccordionSummary
              aria-controls="panel1d-content"
              id="panel2d-header"
              expandIcon={<ExpandMoreIcon />}
              sx={{
                border: `1px solid '#000000`,
                borderRadius: pxToRem(30),
                px: pxToRem(20),
                py: pxToRem(2),
                width: '100%',
                '&.MuiAccordion-root.Mui-expanded': {
                  backgroundColor: '#000000',
                },
                '& .MuiPaper-root-MuiAccordion-root': {
                  backgroundColor: '#000000',
                },
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: '16px',
                  lineHeight: '24ps',
                  letterSpacing: '-3%',
                }}
              >
                검사의 의미
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ol style={{ margin: 0, paddingLeft: '20px' }}>
                <li>
                  <Typography
                    sx={{
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '22px',
                      wordBreak: 'keep-all',
                      wordWrap: 'break-word',
                    }}
                  >
                    본 검사 결과지는 검사 대상자 본인에게만 제공되며, 본인 외의 자가 결과지에 포함된
                    정보의 전부 또는 일부를 제3자에게 공개, 배포, 복사하는 등의 행위를 엄격히
                    금지하고 있습니다. 안전하게 관리하고 있습니다.
                  </Typography>
                </li>
                <li style={{ marginTop: '1.5em' }}>
                  <Typography
                    sx={{
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '22px',
                      wordBreak: 'keep-all',
                      wordWrap: 'break-word',
                    }}
                  >
                    본 검사 결과지 (인쇄물)가 검사대상자 본인(지정된 수신인)이 아닌경우 발신인
                    (검사기관)에 알린 후 즉시 결과지를 반송해 주십시오.
                  </Typography>
                </li>
              </ol>
            </AccordionDetails>
          </Accordion>

          <Accordion
            square
            expanded={expanded === 'panel2'}
            onChange={handleChange('panel2')}
            sx={{
              mt: pxToRem(8),
              p: 0,
              boxShadow: 'none',
              borderColor: '#000000',
              wordBreak: 'keep-all',
              wordWrap: 'break-word',
            }}
          >
            <AccordionSummary
              aria-controls="panel2d-content"
              id="panel2d-header"
              expandIcon={<ExpandMoreIcon />}
              sx={{
                border: `1px solid '#000000`,
                borderRadius: pxToRem(30),
                px: pxToRem(20),
                py: pxToRem(2),
                width: '100%',
                '&.MuiAccordion-root.Mui-expanded': {
                  backgroundColor: '#000000',
                },
                '& .MuiPaper-root-MuiAccordion-root': {
                  backgroundColor: '#000000',
                },
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: '16px',
                  lineHeight: '24ps',
                  letterSpacing: '-3%',
                }}
              >
                개인정보보호 방안
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ol style={{ margin: 0, paddingLeft: '20px' }}>
                <li>
                  <Typography sx={{ fontWeight: 400, fontSize: '14px', lineHeight: '22px' }}>
                    본 검사 결과지는 검사 대상자 본인에게만 제공되며, 본인 외의 자가 결과지에 포함된
                    정보의 전부 또는 일부를 제3자에게 공개, 배포, 복사하는 등의 행위를 엄격히
                    금지하고 있습니다. 안전하게 관리하고 있습니다.
                  </Typography>
                </li>
                <li style={{ marginTop: '1.5em' }}>
                  <Typography sx={{ fontWeight: 400, fontSize: '14px', lineHeight: '22px' }}>
                    본 검사 결과지 (인쇄물)가 검사대상자 본인(지정된 수신인)이 아닌경우 발신인
                    (검사기관)에 알린 후 즉시 결과지를 반송해 주십시오.
                  </Typography>
                </li>
              </ol>
            </AccordionDetails>
          </Accordion>

          <Accordion
            square
            expanded={expanded === 'panel3'}
            onChange={handleChange('panel3')}
            sx={{
              mt: pxToRem(8),
              p: 0,
              boxShadow: 'none',
              borderColor: '#000000',
            }}
          >
            <AccordionSummary
              aria-controls="panel3d-content"
              id="panel3d-header"
              expandIcon={<ExpandMoreIcon />}
              sx={{
                border: `1px solid '#000000`,
                borderRadius: pxToRem(30),
                px: pxToRem(20),
                py: pxToRem(2),
                width: '100%',
                '&.MuiAccordion-root.Mui-expanded': {
                  backgroundColor: '#000000',
                },
                '& .MuiPaper-root-MuiAccordion-root': {
                  backgroundColor: '#000000',
                },
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: '16px',
                  lineHeight: '24ps',
                  letterSpacing: '-3%',
                }}
              >
                주의사항
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ol style={{ margin: 0, paddingLeft: '20px' }}>
                <li>
                  <Typography sx={{ fontWeight: 400, fontSize: '14px', lineHeight: '22px' }}>
                    본 검사 결과지는 검사 대상자 본인에게만 제공되며, 본인 외의 자가 결과지에 포함된 정보의 전부 또는 일부를 제3자에게 공개, 배포, 복사하는 등의 행위를 엄격히 금지하고 있습니다.
                  </Typography>
                </li>
                <li style={{ marginTop: '1.5em' }}>
                  <Typography sx={{ fontWeight: 400, fontSize: '14px', lineHeight: '22px' }}>
                  본 검사 결과는 질병의 진단 및 치료의 목적으로 사용될 수 없으며, 의학적인 소견이 필요한 경우 의사와 상담하시기 바랍니다.
                  </Typography>
                </li>
              </ol>
            </AccordionDetails>
          </Accordion>
        </Stack> */}
      </Stack>
    </>
  );
});

export default Guide;
