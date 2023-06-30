import {
  Accordion as MuiAccrodion,
  AccordionDetails as MuiAccordionDetails,
  AccordionSummary as MuiAccordionSummary,
  Box,
  styled,
  Typography,
  useTheme,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { ReactComponent as ExpandMoreIcon } from 'src/assets/icons/ico-expand-more.svg';
import { pxToRem } from 'src/theme/typography';
import { Card } from '../components/Card';

const Accordion = styled(MuiAccrodion)(({ theme }) => ({
  '&.MuiAccordion-root': {
    border: 0,
    '&:before': {
      display: 'none',
    },
    minHeight: pxToRem(52),
    '&.Mui-expanded': {
      boxShadow: 'none',
      borderRadius: 0,
      backgroundColor: '#fff',
      minHeight: pxToRem(52),
      margin: 0,
    },
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  '&.MuiAccordionDetails-root': {
    padding: `20px 0`,
    borderBottom: '1px solid #ebebeb',
    textAlign: 'left',
  },
}));

const AccordionSummary = styled(MuiAccordionSummary)(({ theme }) => ({
  '&.MuiAccordionSummary-root': {
    minHeight: pxToRem(52),
    borderBottom: '1px solid #ebebeb',
    paddingLeft: 0,
    margin: '0',
    '&.Mui-expanded': {
      minHeight: pxToRem(52),
      margin: '0',
    },
    '& .MuiAccordionSummary-content': {
      margin: '12px 0',
      '&.Mui-expanded': {
        margin: '12px 0',
      },
    },
  },
}));

export interface IAnnouncementProps {}

export const Announcement = observer(({}: IAnnouncementProps) => {
  // const {  } = useStores()
  const theme = useTheme();
  const [expanded, setExpanded] = React.useState<string | false>('panel1');

  const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, newExpanded: boolean) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <Card>
      <Box
        sx={{
          pb: 0.75,
          textAlign: 'left',
        }}
      >
        <Typography variant="Kor_22_b">잠깐만! 👀 확인해 주세요</Typography>
      </Box>

      <Accordion square expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary
          aria-controls="panel1d-content"
          id="panel1d-header"
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography variant="Kor_16_b">서비스 안내</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ol
            style={{
              ...theme.typography.Kor_14_r,
              margin: 0,
              paddingLeft: '1.5em',
              lineHeight: pxToRem(22),
              color: '#5D6066',
            }}
          >
            <li>유전자 검사는 유전자 분석기관 마크로젠에서 진행합니다.</li>
            <li style={{ marginTop: '1.5em' }}>
              젠톡의 DTC 유전자 검사는 만 19세 이상만 신청할 수 있습니다.
            </li>
            <li style={{ marginTop: '1.5em' }}>
              회원가입 이후 최초 구매 시, 유전자 검사 키트가 무료로 지급됩니다.
            </li>
            <li style={{ marginTop: '1.5em' }}>
              동의서 작성 시 추가분석 또는 인체유래물 연구에 동의한 경우, 키트를 구매하지 않아도
              연구소에 보관된 DNA로 서비스 이용이 가능합니다.
            </li>
          </ol>
        </AccordionDetails>
      </Accordion>

      <Accordion square expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
        <AccordionSummary
          aria-controls="panel4d-content"
          id="panel4d-header"
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography variant="Kor_16_b">검사 키트 반송</Typography>
        </AccordionSummary>

        <AccordionDetails>
          <ol
            style={{
              ...theme.typography.Kor_14_r,
              margin: 0,
              paddingLeft: '1.5em',
              lineHeight: pxToRem(22),
              color: '#5D6066',
            }}
          >
            <li>젠톡 앱 또는 웹에서 간편하게 키트 반송을 접수할 수 있습니다.</li>
            <li style={{ marginTop: '1.5em' }}>
              간편한 키트 반송
              <br />
              젠톡 앱/웹 → 주문내역 → 키트 반송 요청 → 반송지 정보 입력 → 신청하기
            </li>
            <li style={{ marginTop: '1.5em' }}>
              반송 시 유의사항
              <ul
                style={{
                  paddingLeft: pxToRem(16),
                }}
              >
                <li>
                  앱/웹 내 반송 접수가 어려울 경우, 키트를 수령하신 택배사 홈페이지 또는
                  고객센터에서 배송 받은 송장 번호로 ‘반품 접수’를 진행해 주세요.
                </li>
                <li>
                  반드시 배송 받았던 택배사를 이용해 반송해주세요. 배송 받은 택배사가 아닌 타
                  택배사로 진행하실 경우 배송비가 과금됩니다. <br />
                </li>
                <li>
                  퀵, 특송 등을 이용하실 경우 고객님에게 즉시 반송 처리되며 왕복 배송비가 과금되오니
                  유의해주세요. <br />
                </li>
                <li>
                  택배 반송 접수 이후 반송일/장소 변경 및 취소 관련 문의는 택배사 고객센터로 문의해
                  주세요(CJ대한통운 1588-1255/우체국 택배 1588-1300) <br />
                </li>
                <li>
                  마크로젠에 키트 반송 접수가 완료되면, CJ대한통운 또는 우체국 택배 배송현황
                  기준으로 알림톡이 발송됩니다. <br />
                </li>
              </ul>
            </li>
          </ol>
        </AccordionDetails>
      </Accordion>

      <Accordion square expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <AccordionSummary
          aria-controls="panel2d-content"
          id="panel2d-header"
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography variant="Kor_16_b">검사 키트 교환</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ol
            style={{
              ...theme.typography.Kor_14_r,
              margin: 0,
              paddingLeft: '1.5em',
              lineHeight: pxToRem(22),
              color: '#5D6066',
            }}
          >
            <li>교환이 필요한 경우, 1:1문의를 통해 키트 사진과 함께 문의사항을 접수해주세요.</li>
            <li style={{ marginTop: '1.5em' }}>
              키트 불량으로 인한 키트 교환은 공급받은 날로부터 3개월 이내 또는 그 사실을 안 날 또는
              알 수 있었던 날부터 30일 이내 정상 키트로 무상 교환이 가능합니다. 이때 배송비는
              마크로젠이 부담합니다.
            </li>
            <li style={{ marginTop: '1.5em' }}>
              자연 재해로 키트 분실 및 파손 시, 공급받은 날로부터 3개월 이내 또는 그 사실을 안 날
              또는 알 수 있었던 날부터 30일 이내 정상 키트로 무상 교환이 가능합니다.
            </li>
            <li style={{ marginTop: '1.5em' }}>
              고객 과실로 키트가 오염되거나 분실된 경우의 교환을 요청하는 경우, 무상 교환이 불가하며
              고객 부담금은 왕복 배송비 포함 18,000원입니다.
            </li>
            <li style={{ marginTop: '1.5em' }}>
              고객 과실 사유의 정의 및 기준
              <ol
                type="a"
                style={{
                  paddingLeft: pxToRem(16),
                }}
              >
                <li>반품요청기간이 지난 경우</li>
                <li>
                  구매자의 책임있는 사유로 상품 또는 포장이 훼손되어 상품가치가 현저히 상실된 경우
                </li>
                <li>
                  구매자의 사용 또는 일부 소비에 의하여 상품의 가치가 현저히 감소한 경우
                  <ul
                    style={{
                      paddingLeft: pxToRem(16),
                    }}
                  >
                    <li>키트 수령 주소 오입력 (배송 불가 또는 오배송으로 인한 분실 우려)</li>
                    <li>
                      키트 수령~택배사 회수 전 택배사 과실이 아닌 본인 과실로 키트가 분실되었을 경우
                      (예: 택배 반송 시, 반송 지정일에 지정 회수 장소에 물품이 없을 경우)
                    </li>
                    <li>키트 반송 완료 후 타액 누락 발견 시</li>
                    <li>타액만 뱉고 보존액을 섞지 않고 보냈을 경우</li>
                    <li>보존액을 일부만 섞어서 보낼 경우</li>
                    <li>뚜껑을 제대로 닫지 않아 타액이 새버린 경우</li>
                    <li>타액 샘플에 립스틱 등 이물질이 들어가 재채취가 필요한 경우</li>
                    <li>보존액 통 혹은 뚜껑이 튜브 안에 들어가 있는 경우 등</li>
                  </ul>
                </li>
                <li>
                  시간의 경과에 의해여 재판매가 곤란할 정도로 상품 등의 가치가 현저히 감소한 경우
                </li>
              </ol>
            </li>
          </ol>
        </AccordionDetails>
      </Accordion>

      <Accordion square expanded={expanded === 'panel5'} onChange={handleChange('panel5')}>
        <AccordionSummary
          aria-controls="panel5d-content"
          id="panel5d-header"
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography variant="Kor_16_b">환불 안내</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ol
            style={{
              ...theme.typography.Kor_14_r,
              margin: 0,
              paddingLeft: '1.5em',
              lineHeight: pxToRem(22),
              color: '#5D6066',
            }}
          >
            <li>
              유전자 검사 서비스는 키트 출고 여부에 따라 환불 정책이 달라집니다. 즉시취소가 안되는
              주문의 경우, 1:1문의를 통해 환불 문의를 접수해주세요.
            </li>

            <li style={{ marginTop: '1.5em' }}>
              문의방법
              <br />
              마이페이지 → 고객센터-[1:1문의] → 문의유형 선택(반품/교환/기타 등) →
              사유선택(단순변심/상품 불량 등) → 본문 내용 기재 → 키트사진 파일 첨부 → 신청 완료
            </li>
            <li style={{ marginTop: '1.5em' }}>
              키트 출고가 없는 구매 건<br />
              키트 출고가 없는 구매 건은 유전자 검사 동의서 작성 전까지 취소가 가능합니다.
              구매일로부터 7일을 초과한 경우, 유전자 검사 동의서를 미작성한 경우라도 자동 구매확정이
              되어 구매 취소가 불가합니다.
            </li>

            <li style={{ marginTop: '1.5em' }}>
              키트 출고가 있는 구매 건
              <ul
                style={{
                  paddingLeft: pxToRem(16),
                }}
              >
                <li>
                  결제 이후 [배송준비중] 단계 이전까지 즉시 취소가 가능합니다. 키트 출고 이전
                  취소요청 시 별도의 승인절차 없이 자동취소 처리가 됩니다. 이 경우 별도의 과금이
                  없으며 취소완료 후에는 철회가 불가합니다.
                </li>
                <li>
                  [배송준비중] 단계부터는 즉시 취소가 불가능하며, 위의 '2. 문의방법' 절차에 따라
                  구매취소 신청을 하여야 합니다. 출고 여부에 따라 [왕복 배송비 8,000원]이 부과될 수
                  있으며, 조건부 환불 기준에 따라 환불 가능 여부가 결정됩니다. 단, 도서 산간의 경우
                  지역별 별도 요금이 부과됩니다.
                </li>
              </ul>
            </li>

            <li style={{ marginTop: '1.5em' }}>
              조건부 환불 기준
              <ol
                type="a"
                style={{
                  paddingLeft: pxToRem(16),
                }}
              >
                <li>
                  반품/취소 사유가 고객과실/단순변심일 때
                  <ul
                    style={{
                      paddingLeft: pxToRem(16),
                    }}
                  >
                    <li>
                      주문신청일 기준 7일 이내 반품요청 & 반품요청일 기준 7일 이내 판매자 상품
                      수령(상품상태 정상) : 왕복 배송비 제외 환불 처리
                    </li>
                    <li>
                      주문신청일 기준 7일 이내 반품요청 & 반품요청일 기준 7일 이내 판매자 상품
                      수령(상품상태 불량) : 왕복 배송비 + 키트비 제외 환불 처리
                    </li>
                    <li>
                      주문신청일 기준 7일 이내 반품요청 & 반품요청일 기준 7일 초과 판매자 상품 수령
                      또는 미반품 : 환불 불가
                    </li>
                    <li>주문신청일 기준 7일 초과 반품요청 : 환불 불가</li>
                  </ul>
                </li>
                <li>
                  반품/취소 사유가 판매자 과실/상품 불량일 때
                  <ul
                    style={{
                      paddingLeft: pxToRem(16),
                    }}
                  >
                    <li>
                      키트 불량으로 인한 키트 교환은 공급받은 날로부터 3개월 이내 또는 그 사실을 안
                      날 또는 알 수 있었던 날부터 30일 이내 정상 키트로 무상 교환이 가능합니다. 이때
                      배송비는 마크로젠이 부담합니다.
                    </li>
                    <li>
                      자연 재해로 키트 분실 및 파손 시, 공급받은 날로부터 3개월 이내 또는 그 사실을
                      안 날 또는 알 수 있었던 날부터 30일 이내 정상 키트로 무상 교환이 가능합니다.
                    </li>
                  </ul>
                </li>
              </ol>
            </li>
          </ol>
        </AccordionDetails>
      </Accordion>

      <Accordion square expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
        <AccordionSummary
          aria-controls="panel3d-content"
          id="panel3d-header"
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography variant="Kor_16_b">개인정보보호 방안</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ol
            style={{
              ...theme.typography.Kor_14_r,
              margin: 0,
              paddingLeft: '1.5em',
              lineHeight: pxToRem(22),
              color: '#5D6066',
            }}
          >
            <li>
              ㈜마크로젠은 개인정보보호법, 동법 시행령 및 시행규칙, 표준 개인정보 보호 지침에서
              정의된 바를 준수하고 분실, 도난, 유출, 변조 또는 훼손되지 않도록 안전하게 관리하고
              있습니다 (정보보호 및 개인정보보호 관리체계 ISMS-P 인증 취득: ISMS-P-KISA-2021-008 /
              국제표준 정보보호 인증 취득: ISO27001).
            </li>
            <li style={{ marginTop: '1.5em' }}>
              의뢰자의 개인정보는 본 검사 목적 외에 사용하지 않는 것을 원칙으로 하되, 의뢰자로부터
              별도로 검사 목적 외 개인정보 제공 동의 획득 시 기재된 이용 목적을 위해 사용할 수
              있습니다.
            </li>
          </ol>
        </AccordionDetails>
      </Accordion>
    </Card>
  );
});
