import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import { useStores } from 'src/models/root-store/root-store-context';
import { Stack, Typography, useTheme, Button, Collapse, Card, Divider } from '@mui/material';
import { CallApiToStore, numberComma } from 'src/utils/common';
import { IInquirySnapshot } from 'src/models/inquiry/Inquiry';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import moment from 'moment';
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import CAlert from 'src/components/CAlert';
import { pxToRem } from 'src/theme/typography';
import parse from 'html-react-parser';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import speech_imm from '../../../../assets/images/speech.svg';
import OrderItemImage from 'src/screens/user/mypage/order-history/order-history-detail/order-history-items/OrderItemImage';
import { toJS } from 'mobx';
// import Icon from 'src/components/color-utils/Icon';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router';
import FaqConnect from '../inquiry-view/FaqConnect';
import { PATH_ROOT } from 'src/routes/paths';
import { InquiryListFaq } from './InquiryListFaq';

/**
 * ## InquiryList 설명
 */

interface Props {
  getData: (id: number) => void;
}
export const InquiryList = observer(({ getData }: Props) => {
  const rootStore = useStores();
  const { inquiryStore, loadingStore } = rootStore;
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { REACT_APP_IMAGE_STORAGE } = process.env;
  const scrollRef = useRef<any>(null);

  // expand 구현
  const [open, setOpen] = useState(false);
  const [select, setSelect] = useState(false);
  const [sid, setSid] = useState(0); //id
  const [deleteSid, setDeleteSid] = useState(0); //삭제할 때 id
  const [alertOpen, setAlertOpen] = useState(false); //alert
  const [openLightBox, setOpenLightBox] = useState(false); //첨부이미지 alert

  // 이미지 modal (업로드할 때 사진, 수정할 떄 사진)
  const [photoIndex, setPhotoIndex] = useState(0);
  const [contentIndex, setContentIndex] = useState(0);

  // 문의 목록 리스트
  const getDatas = async () => {
    CallApiToStore(inquiryStore.gets(), 'api', loadingStore);
    setLoading(false);
  };

  // 문의 삭제 리스트
  const deleteData = async () => {
    if (deleteSid > 0) {
      CallApiToStore(inquiryStore.delete(deleteSid), 'api', loadingStore)
        .then(() => {
          inquiryStore.reset();
          inquiryStore.pagination.setProps({ page: 1 });
          getDatas();
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  // 날짜 return
  const makeDateFormat = (date: number) => {
    let tempDate = new Date(date);
    let year = tempDate.getFullYear();
    let month = ('0' + (1 + tempDate.getMonth())).slice(-2);
    let day = ('0' + tempDate.getDate()).slice(-2);

    return `${year}.${month}.${day}`;
  };

  const handleIsOpen = (sid: number) => {
    setSid(sid);
    open === true ? setOpen(false) : setOpen(true);
    select === true ? setSelect(false) : setSelect(true);
  };

  useEffect(() => {
    inquiryStore.reset();
    inquiryStore.pagination.setProps({ page: 1 });
    getDatas();
  }, []);

  const [editIconActive, setEditIconActive] = useState(false);
  const [trashIconActive, setTrashIconActive] = useState(false);


  return (
    <>
      {/* FAQ 연결 */}
      <Stack sx={{ pt: pxToRem(28), pb: pxToRem(23), px: pxToRem(20), justifyContent: 'left' }}>
        <InquiryListFaq />
      </Stack>
      <Divider sx={{ minHeight: pxToRem(8), bgcolor: theme.palette.grey[100] }} />
      <Stack ref={scrollRef}>
        {inquiryStore.inquirys.map((inquiry: IInquirySnapshot, j: number) => (
          <Box
            key={`inquiryList` + j}
            sx={{ px: 0, background: '#FFFFFF', '&::-webkit-scrollbar': { display: 'none', }, justifyContent: 'center', }}>
            {/* summary */}
            <Box
              id={`myInquiry-id-${inquiry.inquirySid}`}
              sx={{ my: 0, px: pxToRem(20), py: pxToRem(2), borderBottom: `1px solid #f2f2f2}`, }}
              onClick={() => { handleIsOpen(inquiry.inquirySid) }}
            >
              <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} sx={{ py: pxToRem(14) }}
              >
                <Box
                  sx={{ display: 'flex', flexDirection: 'column', textAlign: 'left', width: '92%', }}>
                  <Typography
                    sx={{
                      fontWeight: 400, lineHeight: 24 / 16, fontSize: pxToRem(16), letterSpacing: '-0.01em', width: '95%', wordBreak:
                        open === true && sid === inquiry.inquirySid ? 'break-all' : 'break-word', overflow: open === true && sid === inquiry.inquirySid ? 'visible' : 'hidden', textOverflow:
                        open === true && sid === inquiry.inquirySid ? 'initial' : 'ellipsis', whiteSpace: open === true && sid === inquiry.inquirySid ? 'noraml' : 'nowrap',
                    }}
                  >
                    {inquiry.inquiryNm}
                  </Typography>
                  <Typography variant={'Kor_12_r'} sx={{ mt: pxToRem(5) }} color={theme.palette.primary.dark}>
                    {
                      <Typography
                        variant={'Kor_12_r'}
                        color={inquiry.answerConts !== null ? theme.palette.grey[500] : theme.palette.primary.dark}>
                        {inquiry.answerConts !== null ? '[답변 완료]' : '[답변 대기중]'}
                      </Typography>
                    }
                    <Typography variant={'Kor_12_r'} color={theme.palette.grey[500]}>
                      &nbsp; {moment(inquiry.regDt).format('YYYY/MM/DD')}
                    </Typography>
                  </Typography>
                </Box>
                <Box width={'8%'} sx={{ pr: 0, verticalAlign: 'middle', height: '100%', my: 'auto', cursor: 'pointer', transform: open === true && sid === inquiry.inquirySid ? 'rotate(180deg)' : 'rotate(0deg)', transition: `0.3s ease-in-out`, }}>
                  <ExpandMoreIcon sx={{ color: theme.palette.action.disabled }} />
                </Box>
              </Box>
            </Box>

            {/* detail */}
            {sid === inquiry.inquirySid && (
              <Collapse in={open && select}>
                <Box sx={{ background: theme.palette.grey[100], borderBottom: '1px solid #DFE3E8', textAlign: 'left', my: 0, px: pxToRem(20), py: pxToRem(10), width: '100%', height: '100%', transition: open === true && sid === inquiry.inquirySid ? `height 0.5s ease-in-out isShow` : 'none', }} >
                  <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'left', flexWrap: 'nowrap', }}>
                    {/* 문의 내용 */}
                    <Box sx={{ mt: pxToRem(10), fontWeight: 400, lineHeight: 24 / 16, fontSize: pxToRem(16), letterSpacing: '-0.01em', wordWrap: 'break-word', }}> {parse(inquiry.inquiryConts.replace(/\n/gi, '<br />'))} </Box>
                    {/* 문의한 주문 내용 */}
                    {inquiry?.order !== null && (
                      <Card sx={{ width: '100%', height: '100%', boxShadow: 'none', mt: pxToRem(12), pb: inquiry.order && inquiry.order?.goodsList.length > 1 ? pxToRem(15) : pxToRem(3), bgcolor: '#ffffff', borderRadius: pxToRem(5), }}>
                        <Box sx={{ py: 1.5 }}>
                          <Stack direction={'row'} sx={{ mx: pxToRem(20), display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'left' }}>
                            {/* 상단 날짜 & 주문번호 */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography sx={{ mr: 1, textAlign: 'left', }} variant={'Kor_14_b'}> {inquiry.order?.orderDt && makeDateFormat(inquiry.order?.orderDt)} </Typography>
                                <Typography variant={'Kor_12_r'} sx={{ color: theme.palette.grey[400], textAlign: 'left', }}> {inquiry.order?.orderNo} </Typography>
                              </Box>
                              <Box component={Icon} icon={'ep:arrow-right-bold'} sx={{ cursor: 'pointer', color: theme.palette.action.disabled, }} onClick={() => { navigate(`/user/mypage/order-history/detail/${inquiry.order?.orderNo}`) }}></Box>
                            </Box>

                            <Box sx={{ display: 'flex', mt: pxToRem(12), width: '100%' }} borderRadius={2}>
                              {/* 좌측 이미지 */}
                              <Stack sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex' }}>
                                  <OrderItemImage
                                    imgSrc={`${inquiry.order?.img1Path}`}
                                    listSize={Number(`${inquiry.order?.goodsList.length}`)} />

                                  {/* 우측 컨텐츠 */}
                                  <Stack sx={{ textAlign: 'left', width: '100%' }}>
                                    <Box display={'flex'} flexDirection={'column'} sx={inquiry.order && inquiry.order?.goodsList.length > 1 ? multiGoodsStyle : singleGoodsStyle}>
                                      <Box sx={{ display: 'inline-flex', flexWrap: 'wrap' }}>
                                        <Typography variant={'Kor_16_b'} display={'inline'} sx={{ color: '#202123', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: inquiry.order?.goodsList?.length! > 1 ? '50%' : '100%', }}>
                                          {inquiry?.order && inquiry.order?.goodsList[0]?.goodsNm!}
                                        </Typography>
                                        {inquiry.order && inquiry.order?.goodsList.length > 1 ? (
                                          <>
                                            <Typography variant={'Kor_16_b'} display={'inline'} sx={{ color: '#202123' }}>&nbsp;포함</Typography>
                                            <Typography variant={'Kor_16_b'} display={'inline'} sx={{ color: theme.palette.primary.main }}>&nbsp;[총 {inquiry.order?.goodsList.length}개]</Typography>
                                          </>) : (<Box></Box>)}
                                      </Box>

                                      <Typography variant="Kor_12_r">  {/* sx={{ textDecoration: isCancel ? 'line-through' : null }} */}
                                        {inquiry && (numberComma(Number(inquiry.order?.paymentAmt)))}
                                        {(inquiry.order?.goodsList && (inquiry.order?.goodsList[0]?.currencyCd! && inquiry.order?.goodsList[0].currencyCd?.value!)) || '원'}
                                      </Typography>
                                    </Box>
                                  </Stack>
                                </Box>
                              </Stack>
                            </Box>
                          </Stack>
                        </Box>
                      </Card>

                    )}

                    <Stack>
                      {inquiry.attachImgPathList.length > 0 ? (
                        <>
                          <Typography variant={'Kor_14_b'} sx={{ mt: pxToRem(30) }}>첨부된 사진</Typography>
                          <Box
                            sx={{ display: 'flex', flexDirection: 'row', color: theme.palette.grey[600], my: pxToRem(4), overflow: 'hidden', }}>
                            {inquiry.attachImgPathList.map((imgsrc: string, i: number) => {
                              return (
                                <Image src={REACT_APP_IMAGE_STORAGE + imgsrc} placeholderSrc={'/assets/placeholder.svg'} key={`imgsrc` + i}
                                  onClick={() => {
                                    setContentIndex(j);
                                    setPhotoIndex(i);
                                    setOpenLightBox(true);
                                  }}
                                  sx={{ display: 'block', mr: pxToRem(8), p: 0, width: pxToRem(90), height: pxToRem(90), backgroundColor: theme.palette.grey[500], }}
                                />
                              );
                            })}</Box></>) : null}
                    </Stack>
                  </Box>

                  {/* 수정, 삭제하기 */}
                  <Box sx={{ display: 'flex', textAlign: 'right', justifyContent: 'flex-end', color: theme.palette.grey[400], marginTop: pxToRem(35), marginBottom: pxToRem(5), }}>
                    {inquiry.answerConts !== null ? null : (
                      <Iconify icon="material-symbols:edit-outline" onClick={() => { getData(inquiry.inquirySid) }} style={{ display: inquiry.answerConts === null ? 'block' : 'none', color: editIconActive ? theme.palette.warning.main : theme.palette.grey[500], fontSize: pxToRem(24), cursor: 'pointer', }} />)}
                    <Iconify icon="mdi:trash-outline" style={{ color: trashIconActive ? theme.palette.warning.main : theme.palette.grey[500], fontSize: pxToRem(24), marginLeft: pxToRem(8), cursor: 'pointer', }}
                      onClick={() => { setDeleteSid(inquiry.inquirySid); setAlertOpen(true); }} />
                  </Box>
                </Box>
              </Collapse>
            )}

            {/* 문의 답변
              inquiry.answerConts !== null => 관리자페이지 만들어지면 삭제
             */}
            {inquiry.answerConts === null ||
              (open === true && sid === inquiry.inquirySid) ? null : (
              // <InquiryAnswer getData={getData} inquirySid={inquiry.inquirySid} />
              <Box sx={{ display: 'flex', background: theme.palette.grey[100], borderBottom: '1px solid #DFE3E8', textAlign: 'left', px: pxToRem(20), py: pxToRem(20), }} >
                <Box component={'img'} src={speech_imm} sx={{ pb: pxToRem(9), mr: pxToRem(5), color: theme.palette.grey[500], fontSize: pxToRem(20), }} ></Box>
                <Typography variant={'Kor_14_r'} sx={{ textAlign: 'left', wordBreak: 'break-word', }}>
                  {inquiry.answerConts !== null && parse(inquiry.answerConts?.replace(/\n/gi, '<br />'))}
                </Typography>
              </Box>
            )}
          </Box>
        ))}
      </Stack>

      {inquiryStore.inquirys?.length === 0 ? (<Typography variant={'body1'} color={theme.palette.grey[500]} sx={{ mt: pxToRem(90), }} > 문의한 내역이 없습니다.</Typography>) : (<></>)}

      {/* 더보기 버튼 */}
      {inquiryStore.inquirys.length > 0 && inquiryStore.pagination.totalElements > 0 && (
        <Button
          variant={'text'}
          sx={{ p: 0, pt: 1, mb: pxToRem(80), color: theme.palette.common.black, fontWeight: 400, fontSize: pxToRem(14), '&.Mui-disabled': { fontSize: pxToRem(14), fontWeight: 400, background: '#FFFFFF', color: '#999999', } }}
          disabled={inquiryStore.pagination.totalElements - 1 < inquiryStore.inquirys.length}
          onClick={() => {
            inquiryStore.pagination.setProps({ page: inquiryStore.pagination.page + 1, });
            getDatas();
          }}
        >
          {inquiryStore.pagination.totalElements < 1 ? (
            '문의한 내역이 없습니다.'
          ) : inquiryStore.inquirys.length < inquiryStore.pagination.size ? (
            <></>
          ) : inquiryStore.pagination.totalElements - 1 < inquiryStore.inquirys.length ? (
            '더이상 불러올 나의 문의 내역이 없습니다.'
          ) : (
            <>
              더보기
              <Iconify width={pxToRem(12)} ml={pxToRem(6)} icon={'simple-line-icons:arrow-down'} />
            </>
          )}
        </Button>
      )}

      {/* openLightBox : 이미지 modal */}
      {openLightBox && (
        <Lightbox
          open={openLightBox}
          close={() => {
            setOpenLightBox(false);
          }}
          index={photoIndex}
          carousel={{ finite: true }}
          styles={{ container: { backgroundColor: 'rgba(0, 0, 0, .7)' } }}
          slides={inquiryStore.inquirys[contentIndex].attachImgPathList.map(
            (src: any, i: number) => {
              return { src: REACT_APP_IMAGE_STORAGE + src, width: 1000, height: 1500 };
            },
          )}
          render={{
            buttonPrev:
              inquiryStore.inquirys[contentIndex].attachImgPathList.length <= 1
                ? () => null
                : undefined,
            buttonNext:
              inquiryStore.inquirys[contentIndex].attachImgPathList.length <= 1
                ? () => null
                : undefined,
          }}
        />
      )}

      {/* 삭제 alert */}
      {alertOpen && (
        <CAlert
          isAlertOpen={true}
          alertCategory={'success'}
          alertTitle={'정말 삭제하시겠습니까?'}
          hasCancelButton={true}
          handleAlertClose={() => {
            setAlertOpen(false);
            setOpen(false);
            setSelect(false);
          }}
          callBack={() => {
            deleteData();
          }}
        ></CAlert>
      )}
    </>
  );
});

export default InquiryList;

const multiGoodsStyle = {
  alignItems: 'flex-start',
  justifyContent: 'center',
  ml: pxToRem(10),
  height: 70,
  width: '100%',

  // mb: 1.5,
  // mt: pxToRem(3),
};

const singleGoodsStyle = {
  alignItems: 'flex-start',
  justifyContent: 'center',
  ml: pxToRem(10),
  // justifyContent: 'flex-start',
  // mt: pxToRem(10),
  height: '100%',
  width: '100%',
};
