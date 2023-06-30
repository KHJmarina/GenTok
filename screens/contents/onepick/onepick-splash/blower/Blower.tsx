import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from '../../../../../models/root-store/root-store-context';
import { Typography, useTheme } from '@mui/material';
import Matter from 'matter-js';
import Image from 'src/components/image';
import onepickCandyTypo from '../../../../../assets/images/onepick-candy-typo.svg';

/**
 * ## Blower 설명
 *
 */
export const Blower = observer(() => {
  const BALLS_COUNT = 40;
  const BALL_RADIUS = 10;
  const CANVAS_WIDTH = 300;
  const CANVAS_HEIGHT = 456;

  const init = () => {
    const Engine = Matter.Engine,
      Render = Matter.Render,
      World = Matter.World,
      Bodies = Matter.Bodies,
      Body = Matter.Body,
      Runner = Matter.Runner,
      Events = Matter.Events;

    const engine = Engine.create();
    const runner = Runner.run(engine);

    const render = Render.create({
      canvas: document.getElementById('canvas') as HTMLCanvasElement,
      engine: engine,
      options: {
        wireframes: false,
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        background: 'transparent',
      },
    });

    const balls: any[] = [];
    const ballImagePaths = [
      '/assets/images/blower/1.png',
      '/assets/images/blower/2.png',
      '/assets/images/blower/3.png',
      '/assets/images/blower/4.png',
      '/assets/images/blower/5.png',
      '/assets/images/blower/6.png',
      '/assets/images/blower/7.png',
      '/assets/images/blower/8.png',
      '/assets/images/blower/9.png',
      '/assets/images/blower/10.png',
      '/assets/images/blower/11.png',
      '/assets/images/blower/12.png',
      '/assets/images/blower/13.png',
      '/assets/images/blower/14.png',
      '/assets/images/blower/15.png',
      '/assets/images/blower/16.png',
      '/assets/images/blower/17.png',
      '/assets/images/blower/18.png',
      '/assets/images/blower/19.png',
      '/assets/images/blower/20.png',
      '/assets/images/blower/21.png',
      '/assets/images/blower/22.png',
      '/assets/images/blower/23.png',
      '/assets/images/blower/24.png',
      '/assets/images/blower/25.png',
      '/assets/images/blower/26.png',
      '/assets/images/blower/27.png',
      '/assets/images/blower/28.png',
      '/assets/images/blower/29.png',
      '/assets/images/blower/30.png',
      '/assets/images/blower/31.png',
      '/assets/images/blower/32.png',
      '/assets/images/blower/33.png',
      '/assets/images/blower/34.png',
      '/assets/images/blower/35.png',
      '/assets/images/blower/36.png',
      '/assets/images/blower/37.png',
      '/assets/images/blower/38.png',
      '/assets/images/blower/39.png',
      '/assets/images/blower/40.png',
      '/assets/images/blower/41.png',
      '/assets/images/blower/42.png',
      '/assets/images/blower/43.png',
      '/assets/images/blower/44.png',
      '/assets/images/blower/45.png',
      '/assets/images/blower/46.png',
      '/assets/images/blower/47.png',
      '/assets/images/blower/48.png',
      '/assets/images/blower/49.png',
      '/assets/images/blower/50.png',
      '/assets/images/blower/51.png',
      '/assets/images/blower/52.png',
      '/assets/images/blower/53.png',
      '/assets/images/blower/54.png',
      '/assets/images/blower/55.png',
      '/assets/images/blower/56.png',
      '/assets/images/blower/57.png',
      '/assets/images/blower/58.png',
      '/assets/images/blower/59.png',
      '/assets/images/blower/60.png',
      '/assets/images/blower/61.png',
      '/assets/images/blower/62.png',
      '/assets/images/blower/63.png',
      '/assets/images/blower/64.png',
      '/assets/images/blower/65.png',
      '/assets/images/blower/66.png',
      '/assets/images/blower/67.png',
      '/assets/images/blower/68.png',
      '/assets/images/blower/69.png',
      '/assets/images/blower/70.png',
      '/assets/images/blower/71.png',
      '/assets/images/blower/72.png',
      '/assets/images/blower/73.png',
      '/assets/images/blower/74.png',
      '/assets/images/blower/75.png',
    ];

    const createBall = () => {
      const ball = Bodies.circle(
        render.canvas.width / 2 - BALL_RADIUS,
        render.canvas.height / 2 - 2 * BALL_RADIUS,
        BALL_RADIUS,
        {
          restitution: 1.03,
          render: {
            sprite: {
              texture: ballImagePaths[Math.round(Math.random() * (ballImagePaths.length - 1))],
              xScale: 1,
              yScale: 1,
            },
          },
        },
      );
      balls.push(ball);
      return ball;
    };

    const onRenderTick = () => {
      balls.forEach((ball) => {
        if (ball.position.y >= render.canvas.height - 100) {
          Body.applyForce(
            ball,
            { x: ball.position.x, y: ball.position.y },
            { x: 0.003, y: -0.003 },
          );
        }
        if (ball.position.y < 120) {
          Body.applyForce(
            ball,
            { x: ball.position.x, y: ball.position.y },
            { x: -0.003, y: 0.003 },
          );
        }

        if (ball.position.x < 80) {
          Body.applyForce(
            ball,
            { x: ball.position.x, y: ball.position.y },
            { x: 0.003, y: -0.003 },
          );
        }

        if (ball.position.x > render.canvas.width - 80) {
          Body.applyForce(
            ball,
            { x: ball.position.x, y: ball.position.y },
            { x: -0.003, y: 0.003 },
          );
        }
      });
    };

    // Add the balls to the scene
    for (let i = 0; i < BALLS_COUNT; i++) {
      World.add(engine.world, createBall());
    }

    // Run the engine
    Engine.run(engine);
    Render.run(render);

    /**
     * Build the circle bounds - BEGIN
     * */
    const addBody = (...bodies: any[]) => {
      World.add(engine.world, bodies);
    };

    const addRect = ({ x = 0, y = 0, w = 10, h = 10, options = {} } = {}) => {
      const body = Bodies.rectangle(x, y, w, h, options);
      addBody(body);
      return body;
    };

    const sW = CANVAS_WIDTH;
    const sH = CANVAS_WIDTH;
    const m = Math.min(sW, sH);
    const rat = (1 / 4.5) * 2;
    const r = m * rat;
    const pegCount = 64;
    const TAU = Math.PI * 2;
    for (let i = 0; i < pegCount; i++) {
      const segment = TAU / pegCount;
      const angle2 = (i / pegCount) * TAU + segment / 2;
      const x2 = Math.cos(angle2);
      const y2 = Math.sin(angle2);
      const cx2 = x2 * r + sW / 2;
      const cy2 = y2 * r + sH / 2;
      addRect({
        x: cx2,
        y: cy2,
        w: (100 / 1000) * m,
        h: (3000 / 1000) * m,
        options: {
          angle: angle2,
          isStatic: true,
          density: 1,
          render: {
            fillStyle: 'transparent',
            strokeStyle: 'white',
            lineWidth: 0,
          },
        },
      });
    }
    // Build the circle bounds - END

    // Start the blowing with X seconds delay
    setTimeout(() => {
      Events.on(runner, 'tick', onRenderTick);
    }, 1000);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <Box sx={{ ...styles.body }}>
        <Box sx={{ ...styles.container }}>
          <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
            <Typography variant={'Kor_24_b'} sx={{ mr: 1 }}>
              빙글 빙글
            </Typography>
            <Image src={onepickCandyTypo} sx={{ maxWidth: 35, maxHeight: 35 }} />
          </Box>
          <Typography variant={'Kor_24_b'} sx={{ mb: '50px' }}>
            어떤 쿠폰이 나올까요?
          </Typography>
          <Box sx={{ ...styles.canvasWrapper }}>
            <canvas
              id="canvas"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '80%',
                transform: 'translate(-50%, -50%)',
              }}
            ></canvas>
            <img src="/assets/images/blower/bt.png" />
          </Box>
        </Box>
      </Box>
    </>
  );
});

export default Blower;

const styles = {
  body: {
    background: '#fedba6',
    width: '100%',
    height: '100%',
  },
  container: {
    display: 'flex',
    width: '100%',
    height: '100vh',
    minWidth: '375px',
    maxWidth: '375px',
    margin: '0 auto',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    mb: '50px',
  },
  canvasWrapper: {
    position: 'relative',
    background: 'url(/assets/images/blower/blower.png)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    margn: '0 auto',
    width: '90%',
    height: '120vw',
    maxHeight: '450px',
    minHeight: '300px',
    backgroundPosition: 'center',
    '&::before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: '35%',
      left: '50%',
      zIndex: 9,
      width: '80%',
      height: '15%',
      background: 'url(/assets/images/blower/logo.png) no-repeat center center',
      transform: 'translate(-50%, -50%)',
      backgroundSize: 'contain',
    },
    '&:after': {
      content: '""',
      borderRadius: '100%',
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '87%',
      height: '87%',
      transform: 'translateY(-50%) translateX(- 50%)',
    },
    '& > img': {
      position: 'absolute',
      bottom: '-100px',
      width: '100%',
      transform: 'translateX(-50%)',
      left: '50%',
    },
  },
};
