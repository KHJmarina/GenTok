import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from '../../../models/root-store/root-store-context';
import { Stack, useTheme } from '@mui/material';
// 로그인  계정 이미지
import facebook_imm from '../../../assets/images/facebookPost.svg';
import twiter_imm from '../../../assets/images/twiterPost.svg';
import kakao_imm from '../../../assets/images/kakaoPost.svg';
import url_imm from '../../../assets/images/urlPost.svg';
// --------------------------------------------------------------------------
import FormProvider from 'src/components/hook-form';
import { useForm } from 'react-hook-form';
import share from 'src/utils/share';
import { IUserSnapshot } from 'src/models/user/user';
import { pxToRem } from 'src/theme/typography';
import { CallApiToStore, sendReactNativeMessage } from 'src/utils/common';
//
import { toJS } from 'mobx';
import { copyToClipboard } from 'src/utils/copyToClipboard';
import { PATH_ROOT } from 'src/routes/paths';
import { CopyToClipboard } from 'react-copy-to-clipboard';


/**
 * ## Share 설명
 *
 */
declare global {
  interface Window {
    Kakao: any;
  }
}

interface Props {
  handleAlertClose?: VoidFunction;
  card?: string;
  shareData?: any;
}

export const Share = observer(({ shareData, card = 'summary_large_image', handleAlertClose }: Props) => {
  const rootStore = useStores();
  const { gameStore, userStore, loadingStore, shareStore } = rootStore;
  const theme = useTheme();

  /**
  * FormProvider
  */
  const methods = useForm<any>({ defaultValues: '' });
  const { handleSubmit, formState: { errors } } = methods;
  const host: string = 'https://gentok.net/';
  const dlHost: string = 'https://nmgentok.page.link/';
  const facebook_share_url = 'http://www.facebook.com/sharer/sharer.php?u=';
  const twitter_share_url = 'https://twitter.com/intent/tweet?url=';
  const onSubmit = async () => { };

  useEffect(() => {
    if (window.Kakao) {
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init('ee050318dc00d7e1a54075f958782cc4');
      }
    }
    sendReactNativeMessage({
      type: 'getOSType',
      payload: {},
    });
  }, [])
  /**
   * short url api 호출
   * snsShareTypeCd : 공유 유형 코드 Kakao: 900701 Facebook:900702 Twitter:900703 URL : 900704
  */

  // 컨텐츠 유형 코드
  const [contsTypeCd, setContsTypeCd] = useState<number>(0)
  useEffect(() => {
    if (rootStore) {
      toJS(rootStore?.codeListStore.list[34].list).map((e: any) => {
        if (e.value === shareData.type) {
          setContsTypeCd(e.code)
        }
      })
    }
  }, []);


  // 트위터, 페이스북 공유하기
  const getShortUrl = async (title: string, desc: string, img: string, isApp: boolean, snsShareTypeCd: number, contsTypeCd: number, contsSid: number, contsResult: string, url: string, card: string) => {
    CallApiToStore(shareStore.get(title, desc, img, isApp, snsShareTypeCd, contsTypeCd, contsSid, contsResult, url, card), 'api', loadingStore)
      .then((e) => {
        handleAlertClose && handleAlertClose();
        // APP
        if (userStore.os) {
          if (snsShareTypeCd === 900702) {
            sendReactNativeMessage({
              type: 'shareFacebook',
              payload: {
                url: facebook_share_url + shareStore?.shortURL.viewUrl
              },
            });
          } else if (snsShareTypeCd === 900703) {
            sendReactNativeMessage({
              type: 'shareTwitter',
              payload: {
                url: twitter_share_url + shareStore?.shortURL.viewUrl
              },
            });
          }
        } else {
          // WEB
          const win = window.open(
            'about:blank',
            "share",
            "top=10, left=10, width=500, height=600, status=no, menubar=no, toolbar=no, resizable=no"
          );
          let url = '';
          if (snsShareTypeCd === 900702) {
            url = facebook_share_url + shareStore?.shortURL.viewUrl;
          } else if (snsShareTypeCd === 900703) {
            url = twitter_share_url + shareStore?.shortURL.viewUrl;
          }
          if (win) {
            win.location.href = url;
          } else {
            const a = document.createElement('a');
            a.target = '_blank';
            a.href = url;
            document.body.appendChild(a);
            setTimeout(() => {
              a.click();
              document.removeChild(a);
            }, 500)
          }
          handleAlertClose && handleAlertClose();
        }
      }).catch((e) => {
        console.log(e);
      });
  };

  // url 공유하기
  const getUrl = async (title: string, desc: string, img: string, isApp: boolean, snsShareTypeCd: number, contsTypeCd: number, contsSid: number, contsResult: string, url: string) => {
    CallApiToStore(shareStore.get(title, desc, img, isApp, snsShareTypeCd, contsTypeCd, contsSid, contsResult, url, card), 'api', loadingStore)
      .then(async (e) => {
        handleAlertClose && handleAlertClose();
        if (userStore.os) {
          const res = await share({ url: shareStore?.shortURL.viewUrl || '' })
          if (res === 'copiedToClipboard') {
            alert('링크가 클립보드에 복사되었습니다다')
          } else {
            alert('적합한 환경이 아닙니다.')
          }
        } else {
          const res = await copyToClipboard(shareStore?.shortURL.viewUrl || '');
          if (res) {
            alert('링크가 클립보드에 복사되었습니다다  1')
          }
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };



  /**
   * 카카오톡
   * 링크 공유
   * svg 허용 불가 -> 캡처하여 img 사용
   * toDataUrl : 이미지 캡처
   * shareKakao : 공유하기 함수
   */
  const shareKakao = async (title: string, desc: string, img: string, isApp: boolean, snsShareTypeCd: number, contsTypeCd: number, contsSid: number, contsResult: string, url: string, card: string) => {
    // use react native - share
    handleAlertClose && handleAlertClose();
    CallApiToStore(shareStore.get(title, desc, img, isApp, snsShareTypeCd, contsTypeCd, contsSid, contsResult, url, card), 'api', loadingStore).then((e) => {
      if (userStore.os) {
        if (shareData.path === 'market') {
          sendReactNativeMessage({
            type: 'shareKakao',
            payload: {
              templateId: 94697,
              profileName: 'DNA 마켓',
              profileImage: host + 'src/assets/images/share-market.png',
              profileUrl: shareStore?.shortURL.listUrl && shareStore?.shortURL.listUrl.replace(dlHost, ''),
              profileOriUrl: `${PATH_ROOT.market.root}`,
              title: shareData.title || shareData.desc,
              desc: shareData.desc || '',
              image: shareData.img,
              viewUrl: shareStore?.shortURL.viewUrl && shareStore?.shortURL.viewUrl.replace(dlHost, ''),
              oriUrl: shareData.url,
            },
          });
        } else if (shareData.path === 'dna') { // 검사결과
          sendReactNativeMessage({
            type: 'shareKakao',
            payload: {
              templateId: 94698,
              profileName: '나의 DNA 능력카드를 발견하세요',
              profileImage: host + 'src/assets/images/share-dnacard.png',
              profileUrl: shareStore?.shortURL.listUrl && shareStore?.shortURL.listUrl.replace(dlHost, ''),
              profileOriUrl: `${PATH_ROOT.market.root}`,
              title: shareData.title || shareData.desc,
              desc: shareData.desc || '',
              image: shareData.img,
              viewUrl: shareStore?.shortURL.viewUrl && shareStore?.shortURL.viewUrl.replace(dlHost, ''),
              oriUrl: shareData.url,
            },
          });
        } else if (shareData.path === 'event') { // 검사결과
          sendReactNativeMessage({
            type: 'shareKakao',
            payload: {
              templateId: 95031,
              profileName: '이벤트',
              profileImage: host + 'src/assets/images/share-dnacard.png',
              profileUrl: shareStore?.shortURL.listUrl && shareStore?.shortURL.listUrl.replace(dlHost, ''),
              profileOriUrl: `${PATH_ROOT.event.root}`,
              title: shareData.title || shareData.desc,
              desc: shareData.desc || '',
              image: shareData.img,
              viewUrl: shareStore?.shortURL.viewUrl && shareStore?.shortURL.viewUrl.replace(dlHost, ''),
              oriUrl: shareData.url,
            },
          });
        } else if (shareData.type === 'MBTI') {
          sendReactNativeMessage({
            type: 'shareKakao',
            payload: {
              templateId: 95017,
              profileName: 'MBTI 유형테스트',
              profileImage: host + 'src/assets/images/share-typetest.png',
              profileUrl: shareStore?.shortURL.listUrl && shareStore?.shortURL.listUrl.replace(dlHost, ''),
              profileOriUrl: `${PATH_ROOT.contents.root}`,
              title: shareData.title || shareData.desc,
              desc: shareData.desc || '',
              image: shareData.img,
              viewUrl: shareStore?.shortURL.viewUrl && shareStore?.shortURL.viewUrl.replace(dlHost, ''),
              oriUrl: shareData.url,
            },
          });
        } else {
          sendReactNativeMessage({
            type: 'shareKakao',
            payload: {
              templateId: 94187,
              profileName: 'GAME 유형테스트',
              profileImage: host + 'src/assets/images/share-typetest.png',
              profileUrl: shareStore?.shortURL.listUrl && shareStore?.shortURL.listUrl.replace(dlHost, ''),
              profileOriUrl: `${PATH_ROOT.contents.root}`,
              title: shareData.title || shareData.desc,
              desc: shareData.desc || '',
              image: shareData.img,
              viewUrl: shareStore?.shortURL.viewUrl && shareStore?.shortURL.viewUrl.replace(dlHost, ''), //게임 하러가기
              oriUrl: url,
            }
          });
        }

      } else {
        // 마켓 공유
        if (shareData.path === 'market') {
          const payload = {
            templateId: 94697,
            templateArgs: {
              profileName: '유전자 마켓',
              profileImage: host + 'src/assets/images/share-market.png',
              profileUrl: shareStore?.shortURL.listUrl && shareStore?.shortURL.listUrl.replace(dlHost, ''),
              profileOriUrl: `${PATH_ROOT.market.root}`,
              title: shareData.title || shareData.desc,
              desc: shareData.desc || '',
              image: shareData.img,
              viewUrl: shareStore?.shortURL.viewUrl && shareStore?.shortURL.viewUrl.replace(dlHost, ''),
              oriUrl: shareData.url,
            },
          };
          window.Kakao.Share.sendCustom(payload);
        } else if (shareData.path === 'dna') {// 검사결과
          const payload = {
            templateId: 94698,
            templateArgs: {
              profileName: '나의 유전자 능력카드',
              profileImage: host + 'src/assets/images/share-dnacard.png',
              profileUrl: shareStore?.shortURL.listUrl && shareStore?.shortURL.listUrl.replace(dlHost, ''),
              profileOriUrl: `${PATH_ROOT.market.root}`,
              title: shareData.title || shareData.desc,
              desc: shareData.desc || '',
              image: shareData.img,
              viewUrl: shareStore?.shortURL.viewUrl && shareStore?.shortURL.viewUrl.replace(dlHost, ''),
              oriUrl: shareData.url,
            },
          };
          window.Kakao.Share.sendCustom(payload);
        } else if (shareData.path === 'event') {
          // mbti
          const payload = {
            templateId: 95031,
            templateArgs: {
              profileName: '이벤트',
              profileImage: host + 'src/assets/images/share-typetest.png',
              profileUrl: shareStore?.shortURL.listUrl && shareStore?.shortURL.listUrl.replace(dlHost, ''),
              profileOriUrl: shareStore?.shortURL.viewUrl && shareStore?.shortURL.viewUrl.replace(dlHost, ''),
              title: shareData.title || shareData.desc,
              desc: shareData.desc || '',
              image: shareData.img,
              viewUrl: shareStore?.shortURL.viewUrl && shareStore?.shortURL.viewUrl.replace(dlHost, ''),
              oriUrl: shareData.url,
            },
          };
          window.Kakao.Share.sendCustom(payload);
        } else if (shareData.type === 'MBTI') {
          // mbti
          const payload = {
            templateId: 95017,
            templateArgs: {
              profileName: 'MBTI 유형테스트',
              profileImage: host + 'src/assets/images/share-typetest.png',
              profileUrl: shareStore?.shortURL.listUrl && shareStore?.shortURL.listUrl.replace(dlHost, ''),
              profileOriUrl: `${PATH_ROOT.contents.root}`,
              title: shareData.title || shareData.desc,
              desc: shareData.desc || '',
              image: shareData.img,
              viewUrl: shareStore?.shortURL.viewUrl && shareStore?.shortURL.viewUrl.replace(dlHost, ''),
              oriUrl: url,
            },
          };
          console.log('🌈 ~ CallApiToStore ~ payload:', payload)
          window.Kakao.Share.sendCustom(payload);
        } else {
          // game
          const payload = {
            templateId: 94187,
            templateArgs: {
              profileName: 'GAME 유형테스트',
              profileImage: host + 'src/assets/images/share-typetest.png',
              profileUrl: shareStore?.shortURL.listUrl && shareStore?.shortURL.listUrl.replace(dlHost, ''),
              profileOriUrl: `${PATH_ROOT.contents.root}`,
              title: shareData.title || shareData.desc,
              desc: shareData.desc || '',
              image: shareData.img,
              viewUrl: shareStore?.shortURL.viewUrl && shareStore?.shortURL.viewUrl.replace(dlHost, ''),
              oriUrl: url,
            },
          };
          console.log('🌈 ~ CallApiToStore ~ payload:', payload)
          window.Kakao.Share.sendCustom(payload);
        }
      }
    }).catch((e) => {
      alert(e);
    })
  };

  /**
   * default copy text
   */
  const [viewCopyBtn, setViewCopyBtn] = useState(false);
  useEffect(() => {

    // reset
    shareStore?.shortURL.setProps({
      listUrl: null,
      viewUrl: null,
    });

    if (rootStore) {
      let contsTypeCd: number | null = null;
      toJS(rootStore?.codeListStore.list[34].list).map((e: any) => {
        if (e.value === shareData.type) {
          contsTypeCd = e.code
        }
      })
      if (contsTypeCd) {
        CallApiToStore(shareStore.get(
          shareData.title, shareData.desc, shareData.img ? shareData.img : '',
          userStore.os ? true : false,
          900704,
          contsTypeCd,
          shareData.Sid,
          shareData.contsResult ? shareData.contsResult : '', shareData.url
        ), 'api', loadingStore).then((res) => {
          if (shareStore?.shortURL.viewUrl) {
            setViewCopyBtn(true);
          }
        }).catch((e) => {
          alert('url create failed.')
        });
      }
    }

  }, [])

  return (
    <>
      <title>{shareData.title}</title>
      <Stack sx={{ width: '100%' }}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Box
            width={'100%'}
            my={pxToRem(11)}
            sx={{
              [theme.breakpoints.down(376)]: {
                width: '100%',
              },
            }}
          >
            <Stack
              direction={'row'}
              sx={{ width: '100%', gap: 2, justifyContent: 'center', }}>
              {/* 페이스북 */}
              <Box textAlign={'center'} display={'flex'} flexDirection={'column'}>
                <Box component={'img'} src={facebook_imm} width={45} height={45} sx={{ cursor: 'pointer', px: 0.3 }}
                  onClick={() => { getShortUrl(shareData.title, shareData.desc, shareData.img ? shareData.img : '', userStore.os ? true : false, 900702, contsTypeCd, shareData.Sid, shareData.contsResult ? shareData.contsResult : '', shareData.url, shareData.card ? shareData.card : '') }}
                ></Box>
              </Box>

              {/* 트위터 */}
              <Box textAlign={'center'} display={'flex'} flexDirection={'column'}>
                <Box component={'img'} src={twiter_imm} width={45} height={45} sx={{ cursor: 'pointer', px: 0.3 }}
                  onClick={() => { getShortUrl(shareData.title, shareData.desc, shareData.img ? shareData.img : '', userStore.os ? true : false, 900703, contsTypeCd, shareData.Sid, shareData.contsResult ? shareData.contsResult : '', shareData.url, card ? card : '') }}
                />
              </Box>

              {/* 카카오 */}
              <Box textAlign={'center'} display={'flex'} flexDirection={'column'}>
                <Box component={'img'} src={kakao_imm} width={45} height={45} sx={{ cursor: 'pointer', px: 0.3 }}
                  onClick={() => { shareKakao(shareData.title, shareData.desc, shareData.img ? shareData.img : '', userStore.os ? true : false, 900701, contsTypeCd, shareData.Sid, shareData.contsResult ? shareData.contsResult : '', shareData.url, card ? card : '') }} />
              </Box>

              {/* URL */}
              <Box textAlign={'center'} display={'flex'} flexDirection={'column'}>

                {
                  viewCopyBtn &&
                  <CopyToClipboard text={shareStore?.shortURL.viewUrl || 'https://gentok.net'}
                    onCopy={() => alert('링크가 클립보드에 복사되었습니다')}>
                    <Box component={'img'} src={url_imm} width={45} height={45} sx={{ cursor: 'pointer', px: 0.3 }} />
                  </CopyToClipboard>
                }

                {/* <Box component={'img'} src={url_imm} width={45} height={45} sx={{ cursor: 'pointer', px: 0.3 }}
                  onClick={() => {
                    getUrl(shareData.title, shareData.desc, shareData.img ? shareData.img : '', userStore.os ? true : false, 900704, contsTypeCd, shareData.Sid, shareData.contsResult ? shareData.contsResult : '', shareData.url);
                  }}
                /> */}
              </Box>
            </Stack>
          </Box>
        </FormProvider>
      </Stack>
    </>
  );
});
