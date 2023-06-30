import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Menubar } from './Menubar';
export default {
  title: 'Components/Market/Menubar',
  component: Menubar,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof Menubar>;
const Template: ComponentStory<typeof Menubar> = (args) => <Menubar {...args} />;
export const Default = Template.bind({});
Default.args = {
  categories: [
    {
      appId: null,
      nationCd: null,
      langCd: null,
      ctegrySid: 1,
      thumbnlPath: '/contents/test.jpg',
      ctegryNm: '영양소',
      ordr: 0,
      goodsCnt: 20,
      ctegryDescr:
        '비타민 C 농도, 비타민 D 농도, 코엔자임Q10 농도, 마그네슘 농도 , 아연 농도, 철 저장 및 농도, 칼륨 농도, 칼슘 농도, 아르기닌 농도, 지방산 농도 (오메가-3), 지방산 농도 (오메가-6), 비타민 A 농도, 비타민 B6 농도, 비타민 B12 농도, 비타민 E 농도, 비타민 K 농도, 타이로신 농도, 베타인 농도, 셀레늄 농도, 루테인&지아잔틴 농도',
      bannerPath: '',
    },
    {
      appId: null,
      nationCd: null,
      langCd: null,
      ctegrySid: 2,
      thumbnlPath: '/contents/test.jpg',
      ctegryNm: '운동',
      ordr: 0,
      goodsCnt: 8,
      ctegryDescr:
        '근력 운동 적합성, 유산소 운동 적합성, 지구력 운동 적합성, 근육 발달 능력, 단거리 질주 능력, 발목 부상 위험도, 악력, 운동 후 회복능력',
      bannerPath: '',
    },
    {
      appId: null,
      nationCd: null,
      langCd: null,
      ctegrySid: 3,
      thumbnlPath: '/contents/test.jpg',
      ctegryNm: '피부/모발',
      ordr: 0,
      goodsCnt: 13,
      ctegryDescr:
        '기미/주근깨, 색소침착*, 여드름 발생, 피부노화*, 피부염증 (아토피 피부염), 피부염증 (접촉성 피부염), 태양 노출 후 태닝반응, 튼살/각질 (튼살), 튼살/각질 (각질), 남성형 탈모*, 모발 굵기*, 새치, 원형 탈모',
      bannerPath: '',
    },
    {
      appId: null,
      nationCd: null,
      langCd: null,
      ctegrySid: 4,
      thumbnlPath: '/contents/test.jpg',
      ctegryNm: '식습관',
      ordr: 0,
      goodsCnt: 5,
      ctegryDescr: '식욕, 포만감, 단맛 민감도, 쓴맛 민감도, 짠맛 민감도',
      bannerPath: '',
    },
    {
      appId: null,
      nationCd: null,
      langCd: null,
      ctegrySid: 5,
      thumbnlPath: '/contents/test.jpg',
      ctegryNm: '개인특성',
      ordr: 0,
      goodsCnt: 12,
      ctegryDescr:
        '알코올 대사, 알코올 의존성, 알코올 홍조, 와인 선호도, 니코틴 대사, 니코틴 의존성, 카페인 대사*, 카페인 의존성, 불면증, 수면습관/시간 (시간), 아침형, 저녁형 인간, 통증 민감성',
      bannerPath: '',
    },
    {
      appId: null,
      nationCd: null,
      langCd: null,
      ctegrySid: 6,
      thumbnlPath: '/contents/test.jpg',
      ctegryNm: '건강관리',
      ordr: 0,
      goodsCnt: 15,
      ctegryDescr:
        '퇴행성 관절염증 감수성, 멀미, 비만, 요산치, 중성지방농도, 체지방률, 체질량지수, 콜레스테롤 (LDLc), 콜레스테롤 (HDLc), 혈당 (공복), 혈압 (평균), 골질량, 복부비만 (엉덩이허레비율), 운동에 의한 체중감량효과, 체중감량 후 체중회복가능성 (요요가능성)',
      bannerPath: '',
    },
  ],
};
