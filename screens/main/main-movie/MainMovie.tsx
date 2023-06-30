import { observer } from "mobx-react-lite";
import YouTube, { YouTubeProps } from 'react-youtube';
import './MainMovie.css';
/**
 * ## 리액트 유튜브 사용법 https://www.npmjs.com/package/react-youtube
 *
 */
export const MainMovie = observer(() => {
  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    event.target.pauseVideo();
  }

  const opts: YouTubeProps['opts'] = {
    height: '315',
    width: '100%',
    playerVars: {
      autoplay: 0, //자동재생 여부
      rel: 0, //관련 동영상 표시하지 않음
      modestbranding: 1, // 컨트롤 바에 youtube 로고를 표시하지 않음
    },
  };

  const StyleDiv = {
    position: 'relative' as 'relative',
    paddingBottom: '56.25%',
    paddingTop: '0',
    height: '0',
    overflow: 'hidden',
  }

  return (
    <div className="video-wrap" style={StyleDiv}>
      <YouTube videoId="Z8CFCQJ_2w8" opts={opts} onReady={onPlayerReady} />
    </div>
  );
});

export default MainMovie;