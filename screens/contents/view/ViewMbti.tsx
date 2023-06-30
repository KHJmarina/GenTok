import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from 'src/models/root-store/root-store-context';
import { Card, Stack, Typography, useTheme, Divider, Chip, Button, Slide } from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ReactComponent as IconPlay } from 'src/assets/icons/ico-play.svg';
import { ReactComponent as IconShare } from 'src/assets/icons/ico-share.svg';
import { ReactComponent as IconHeart } from 'src/assets/icons/ico-heart.svg';
import { ReactComponent as IconHeartOn } from 'src/assets/icons/ico-heart-on.svg';
import Comment from '../comment/Comment';
import Recommend from '../recommend/Recommend';
import { CallApiToStore, numberComma } from 'src/utils/common';
import { IMbtiSnapshot } from 'src/models/mbti/Mbti';
import { IMbtiQuestionItem } from 'src/models/mbti-question-item/MbtiQuestionItem';
import { merge } from 'lodash';
import { pxToRem } from 'src/theme/typography';
import BackHeader from 'src/components/BackHeader';
import parse from 'html-react-parser';
import Iconify from 'src/components/iconify/Iconify';
import CHeader from 'src/components/CHeader';
import { PATH_ROOT } from 'src/routes/paths';
import CShareAlert from 'src/components/CShareAlert';
import CAlert from 'src/components/CAlert';
import { useAuthContext } from 'src/auth/useAuthContext';
/**
 * ## View 설명
 *
 */
interface Props {
  type?: string;
}
type RedirectLocationState = {
  redirectTo: Location;
};
export const ViewMbti = observer(({type = 'mbti'}: Props) => {
  const { REACT_APP_IMAGE_STORAGE } = process.env;
  const rootStore = useStores();
  const { mbtiStore, commentStore, loadingStore } = rootStore;
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();
  const theme = useTheme();
  const { state: locationState } = useLocation();
  const { redirectTo } = (locationState as RedirectLocationState) || {
    pathname: '',
    search: '',
  };
  
  const params = useParams();
  const { id = '' } = params;

  const [content, setContent] = useState<IMbtiSnapshot | null>(null);
  const [shareOpen, setShareOpen] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')

  const getContent = () => {
    CallApiToStore(mbtiStore.get(Number(id)), 'api', loadingStore)
      .then((res: any) => {
        setContent(mbtiStore.mbti);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    setContent(null);
    // commentStore.resetComments();
    mbtiStore.resetMbti();
    getContent();
    return () => {
      mbtiStore.resetMbti();
      mbtiStore.resetQuestion();
      commentStore.resetComments();
    };
  }, [id, navigate]);

  const [open, setOpen] = useState(false);

  const handleLike = async () => {
    // 이모션(400101 : 좋아요, 400102: 싫어요)
    if (isAuthenticated) {
        const emotionCd = mbtiStore.mbti.myEmotionCd?.code === 400101 ? 400102 : 400101;
        if (mbtiStore.mbti.myEmotionCd?.code === 400101) {
          await mbtiStore.removeLike(mbtiStore.mbti.mbtiSid);
        } else {
          await mbtiStore.addLike(mbtiStore.mbti.mbtiSid, emotionCd);
        }
        mbtiStore.get(Number(id)).then(() => 
          setContent(mbtiStore.mbti)
        );
    } else {
      setAlertMessage('로그인 후 이용 가능합니다.');
      setAlertOpen(true);
    }
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<IMbtiQuestionItem[]>([]);

  const getQuestions = () => {
    CallApiToStore(mbtiStore.getQuestions(mbtiStore.mbti.mbtiSid), 'api', loadingStore)
  };

  const [openResult, setOpenResult] = useState(false);

  const selectAnswer = (item: IMbtiQuestionItem) => {
    setAnswers(merge([...answers.filter((r) => r.mbtiQuestnSid !== item.mbtiQuestnSid), item]));
    if (currentIndex + 1 === mbtiStore.questions.length) {
      answers.push(item);
      getResult();
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const getResult = () => {
    CallApiToStore(mbtiStore.postAnswer(answers), 'api', loadingStore)
      .then(() => {
        navigate(`/contents/mbti/${id}/result/type/${mbtiStore.result?.mbtiTestResultTypeId}`);
      })
      .catch((e) => console.log(e));
  };


  const handleNextMbti = () => {
    if (currentIndex + 1 === mbtiStore.questions[0].itemList.length) {
      alert('END');
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  const options: any = {
    showMainIcon: 'back',
    handleMainIcon: ()=>{
      navigate(-1)
    },
    showHomeIcon: true,
    showCartIcon: true,
  };

  return (
    <>
      {content && (
        <Stack sx={{ flex: 1, height: '100%', pt: 0, pb: 4 }}>
          <CHeader title={'MBTI'} {...options} />
          <Stack spacing={3} sx={{ textAlign: 'left', p: '20px', pt: pxToRem(6) }}>
            <Card elevation={0} sx={{ boxShadow: 'none', background: '#FFFFFF' }}>
              <Box
                id="shareImage" 
                component={'img'}
                src={REACT_APP_IMAGE_STORAGE + (content.thumbnlPath || '/assets/placeholder.svg')}
                width={'100%'}
                sx={{
                  minWidth: 355,
                  minHeight: 355,
                  borderRadius: '15px',
                }}
              />
              <Stack
                direction={'row'}
                alignContent={'center'}
                alignItems={'center'}
                justifyContent={'center'}
                spacing={2}
                sx={{
                  width: '100%',
                  p: '14px 16px',
                  position: 'absolute',
                  bottom: 0,
                  background:
                    'radial-gradient(97.57% 210.75% at 0.9% 2.98%, rgba(255, 255, 255, 0.33) 0%, rgba(0, 0, 0, 0) 100%)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '15px',
                }}
              >
                <Typography
                  variant={'body2'}
                  color={'white'}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <IconPlay style={{ marginRight: 4 }} stroke={'white'} width={20} height={20} />{' '}
                  {numberComma(content.prtcptnCnt)}
                </Typography>
                {/* <Typography
                  variant={'body2'}
                  color={'white'}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <IconShare style={{ marginRight: 4 }} fill={'white'} width={20} height={20} />{' '}
                  {numberComma(content.shareCnt)}
                </Typography>
                <Divider sx={{ height: 14, borderWidth: 1 }} /> */}
                <Typography
                  variant={'body2'}
                  color={'white'}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <IconHeart style={{ marginRight: 4 }} stroke={'white'} width={20} height={20} />{' '}
                  {numberComma(content.likeCnt || 0)}
                </Typography>
              </Stack>
            </Card>

            <Box sx={{ pt: '16px', pb: '4px' }}>
              <Typography variant={'Kor_28_b'} component={'h3'}>
                {content.mbtiNm}
              </Typography>
              <Stack direction={'row'} spacing={'4px'} sx={{ mt: 1,whiteSpace: 'nowrap', overflowX: 'auto', '&::-webkit-scrollbar': { display: 'none'} }}>
                {content.mbtiTag &&
                  content.mbtiTag.split(' ').map((tag: string, i: number) => {
                    return (
                      <Chip
                        key={`tag-${i}`}
                        label={tag}
                        color={'primary'}
                        variant={'outlined'}
                        size={'small'}
                        sx={{ height: '22px', fontSize: pxToRem(12), fontWeight: 400 }}
                      />
                    );
                  })}
              </Stack>
            </Box>

            <Typography variant={'Kor_16_r'}>
              {parse(content.mbtiDescr?.replace(/\n/gi, '<br />') || '')}
            </Typography>

            <Button
              variant={'contained'}
              size={'large'}
              sx={{ mt: 1, borderRadius: 4, fontSize: pxToRem(22), fontWeight: 600, p: 1 }}
              onClick={() => {
                getQuestions();
                navigate(`${PATH_ROOT.contents.mbti + '/' + mbtiStore.mbti.mbtiSid + '/start'}`);
              }}
            >
              시작하기
            </Button>

            <Stack direction={'row'} justifyContent={'center'} spacing={1.5} sx={{ pt: '2px' }}>
              <Box
                sx={{
                  minWidth: 70,
                  maxHeight: 70,
                  borderRadius: '50%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  background: mbtiStore.mbti.myEmotionCd?.code === 400101 ? '' : '#FAFAFA',
                  textAlign: 'center',
                  cursor: 'pointer',
                  border: mbtiStore.mbti.myEmotionCd?.code === 400101 ? '1px solid #eeeeee' : '',
                }}
                onClick={handleLike}
              >
                {mbtiStore.mbti.myEmotionCd?.code === 400101 ? (
                  <>
                    {/* <IconHeartOn width={30} height={30} /> */}
                    <Iconify
                      icon={'ph:heart-straight-fill'}
                      width={25}
                      color={theme.palette.primary.main}
                    />
                    <Typography
                      variant={'Kor_12_r'}
                      component={'div'}
                      sx={{ color: theme.palette.primary.main }}
                    >
                      {numberComma(content.likeCnt || 0)}
                    </Typography>
                  </>
                ) : (
                  <>
                    {/* <IconHeart stroke={'#9DA0A5'} width={30} height={30} /> */}
                    <Iconify icon={'ph:heart-straight-bold'} width={25} color={'#9DA0A5'} />
                    <Typography variant={'Kor_12_r'} component={'div'} sx={{ color: '#9DA0A5' }}>
                      {numberComma(content.likeCnt || 0)}
                    </Typography>
                  </>
                )}
              </Box>

              <Box
                sx={{
                  minWidth: 70,
                  minHeight: 70,
                  borderRadius: '50%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  background: '#FAFAFA',
                  textAlign: 'center',
                  cursor: 'pointer',
                }}
                onClick={()=>{setShareOpen(true)}}
              >
                <IconShare fill={'#9DA0A5'} width={28} height={28} />
                <Typography variant={'Kor_12_r'} component={'div'} sx={{ color: '#9DA0A5' }}>
                  공유하기
                </Typography>
              </Box>
            </Stack>
          </Stack>

          <Divider />

          <Comment contentSid={Number(id)} contentsType={'mbti'} />

          <Divider />

          <Recommend type={'mbti'} />
        </Stack>
      )}

      {shareOpen && (
        <CShareAlert
          isAlertOpen={true}
          alertTitle={'친구에게 공유하기'}
          handleAlertClose={() => {
            setShareOpen(false);
          }}
          shareData={{
            title:content?.mbtiNm, 
            desc:content?.mbtiDescr,
            thumbnlPath:content?.thumbnlPath,
            path: 'content', 
            type:'MBTI', 
            Sid: params.id,
            img:REACT_APP_IMAGE_STORAGE&&REACT_APP_IMAGE_STORAGE + content?.thumbnlPath, 
            url:`https://gentok.net/contents/mbti/${params.id}` 
          }}
        />
      )} 
      {/* 비로그인 시 좋아요 선택 불가 alert */}
      <CAlert
        isAlertOpen={alertOpen}
        alertCategory={'f2d'}
        alertTitle={alertMessage}
        hasCancelButton={false}
        handleAlertClose={() => {
          setAlertOpen(false);
        }}
      ></CAlert>
    </>
  );
});
export default ViewMbti;
