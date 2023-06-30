// routes
import { PATH_ROOT } from '../../../routes/paths';

export const customerServiceNavConfig = [
  {
    title: '자주 찾는 질문 (FAQ)',
    path: PATH_ROOT.customer.faq ,
  },
  {
    title: '1:1 문의',
    path: PATH_ROOT.customer.inquiry,
  },
  {
    title: '공지사항',
    path: PATH_ROOT.customer.notice,
  },
  {
    title: '이용가이드',
    path: PATH_ROOT.customer.guide,
  },
  {
    title: '키트 사용법',
    path: PATH_ROOT.customer.kitGuide,
  },
  {
    title: '알림리스트',
    path: PATH_ROOT.customer.alarm,
  },
];

export default customerServiceNavConfig;
