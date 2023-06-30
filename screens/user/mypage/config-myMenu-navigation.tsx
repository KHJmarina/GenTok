// routes
import { PATH_ROOT } from '../../../routes/paths';

export const myMenuNavConfig = [
  {
    title: '주문내역',
    path: PATH_ROOT.user.mypage.orderHistory,
  },
  {
    title: '유전자 결과',
    path: PATH_ROOT.user.mypage.dnaResult,
  },
  {
    title: 'MBTI 카드',
    path: PATH_ROOT.user.mypage.mbtiCard,
  },
  {
    title: '쿠폰',
    path: PATH_ROOT.user.coupon,
  },
  {
    title: '포인트',
    path: PATH_ROOT.user.point,
  },
  {
    title: '좋아요',
    path: PATH_ROOT.user.mypage.like,
  },
  {
    title: '리뷰',
    path: PATH_ROOT.user.mypage.reviewList,
  },
  // 오픈 시까지 추천인 코드 메뉴 가리기
  // {
  //   title: '추천인 코드',
  //   path: PATH_ROOT.user.mypage.rcmndCode,
  // },
];

export default myMenuNavConfig;
