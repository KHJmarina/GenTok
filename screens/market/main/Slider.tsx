import './scroll.css';
import { ReactComponent as Banner } from '../assets/images/banner.svg';

export interface ISliderProps {
  direction?: 'left' | 'right';
  rotate?: number;
}

export const Slider = ({ direction = 'right', rotate = 0 }: ISliderProps) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        width: '400%',
        height: '100%',
        transform: `rotate(${rotate}deg)`,
      }}
    >
      <div
        style={{
          width: '400%',
          display: 'flex',
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          className={`infinity-scroll-${direction}`}
          style={{
            display: 'flex',
            position: 'absolute',
          }}
        >
          <Banner style={{marginLeft: '-2px'}}/>
          <Banner style={{marginLeft: '-2px'}}/>
          <Banner style={{marginLeft: '-2px'}}/>
          <Banner style={{marginLeft: '-2px'}}/>
          <Banner style={{marginLeft: '-2px'}}/>
          <Banner style={{marginLeft: '-2px'}}/>
          <Banner style={{marginLeft: '-2px'}}/>
          <Banner style={{marginLeft: '-2px'}}/>
        </div>
      </div>
    </div>
  );
};
