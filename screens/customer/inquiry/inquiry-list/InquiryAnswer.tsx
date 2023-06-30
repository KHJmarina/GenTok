import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from 'src/models/root-store/root-store-context';
import { AccordionDetails, Typography, useTheme } from '@mui/material';
import { CallApiToStore } from 'src/utils/common';
import { IInquirySnapshot } from 'src/models/inquiry/Inquiry';
import { pxToRem } from 'src/theme/typography';
import speech_imm from '../../../../assets/images/speech.svg';
import parse from 'html-react-parser';
import { toJS } from 'mobx';

/**
 * ## InquiryList 설명
 *
 */
interface Props {
  getData: (id: number) => void;
  inquirySid: number;
}
export const InquiryAnswer = observer(({ getData, inquirySid }: Props) => {
  const rootStore = useStores();
  const { inquiryStore, loadingStore } = rootStore;
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  // const [alertOpen, setAlertOpen] = useState(false);
  // const [answer, setAnswer] = useState('답변여부');
  // const scrollRef = useRef<any>(null);
  // const [deleteSid, setDeleteSid] = useState(0);
  // const { REACT_APP_IMAGE_STORAGE } = process.env;

  // 문의 목록 리스트
  const getDatas = async () => {
    CallApiToStore(inquiryStore.gets(), 'api', loadingStore);
    setLoading(false);
  };

  useEffect(() => {
    getDatas();
  }, []);

  return (
    <>
      {/* TODO 답변개수에 따라 map (지금 api 없음) */}
      {inquiryStore.inquirys.map((inquiry: IInquirySnapshot, i: number) => {
        return (
          <AccordionDetails
            key={`inquiry` + i}
            sx={{
              display: 'flex',
              background: theme.palette.grey[100],
              borderBottom: '1px solid #DFE3E8',
              textAlign: 'left',
              px: pxToRem(20),
              py: pxToRem(20),
            }}
          >
            <Box
              component={'img'}
              src={speech_imm}
              sx={{
                pb: pxToRem(9),
                color: theme.palette.grey[500],
                fontSize: pxToRem(20),
              }}
            ></Box>

            <Typography variant={'body2'} sx={{ textAlign: 'left' }}>
              &nbsp;{' '}
              {inquiry.answerConts !== null &&
                parse(inquiry.answerConts?.replace(/\n/gi, '<br />'))}
            </Typography>
          </AccordionDetails>
        );
      })}
    </>
  );
});

export default InquiryAnswer;
