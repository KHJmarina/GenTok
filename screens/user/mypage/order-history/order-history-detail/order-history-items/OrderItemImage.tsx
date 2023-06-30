import { Box } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { pxToRem } from 'src/theme/typography';
import Image from 'src/components/image/Image';
import { getImagePath } from 'src/utils/common';

type Props = {
  listSize: number;
  imgSrc?: string;
  getImageSrc?: any;
};

export const OrderItemImage = observer(({ listSize, imgSrc, getImageSrc }: Props) => {
  const { REACT_APP_IMAGE_STORAGE } = process.env;
  // console.log(listSize);
  

  return (
    <>
      { listSize != 0 && (
          listSize === 1 
          ? (
            <>
              {imgSrc
                ? (
                  <Box  
                    component={'img'}
                    src={getImagePath(imgSrc)}
                    sx={{
                      width: pxToRem(80),
                      height: pxToRem(80),
                      border: '1px solid #F5F5F5',
                      borderRadius: pxToRem(10),
                      bgcolor:'#ffffff'
                    }}
                    onError={(e: any) => {
                      e.target.src = '/assets/default-goods.svg';
                    }}
                  />
                ) 
                : (
                  <Box  
                    component={'img'}
                    src={getImagePath(getImageSrc)}
                    sx={{
                      width: pxToRem(80),
                      height: pxToRem(80),
                      border: '1px solid #F5F5F5',
                      borderRadius: pxToRem(10),
                    }}
                    onError={(e: any) => {
                      e.target.src = '/assets/default-goods.svg';
                    }}
                  />
                )
              }
            </>
          )
          : (
            <Box position={'relative'} sx={{ mr: pxToRem(80) }}>
              <Box
                sx={{
                  background: '#EEEDFE',
                  left: pxToRem(8),
                  }}
              />
              <Box
                sx={{
                  background: '#ECF8F1',
                  left: pxToRem(4),
                  top: pxToRem(4),
                  }}
              />
              <Box position={'relative'}>
                <Box
                  sx={[
                    {
                      background: '#FAFAFA',
                      left: pxToRem(8),
                    },
                    myOrderBackGroundCardStyle,
                  ]}
                />
                <Box
                  sx={[
                    {
                      background: '#FAFAFA',
                      left: pxToRem(4),
                      top: pxToRem(4),
                    },
                    myOrderBackGroundCardStyle,
                  ]}
                />
                <Box sx={myOrderCardImgStyle}>
                  {imgSrc
                    ? (
                      <Image
                        src={getImagePath(imgSrc)}
                        ratio={'1/1'}
                        width={pxToRem(90)}
                        height={pxToRem(90)}
                        py={pxToRem(4)}
                        onError={(e: any) => {
                          e.target.src = '/assets/default-goods.svg';
                        }}
                      />
                    ) 
                    : (
                      <Image
                        src={getImagePath(getImageSrc)}
                        ratio={'1/1'}
                        width={pxToRem(90)}
                        height={pxToRem(90)}
                        py={pxToRem(4)}
                        onError={(e: any) => {
                          e.target.src = '/assets/default-goods.svg';
                        }}
                      />
                    )
                  }
                </Box>
              </Box>
            </Box>
          )
      )}
    </>
  )
});

export default OrderItemImage;

const myOrderSingleCardImgStyle = {
  position: 'absolute',
  border: '1px solid #F5F5F5',
  background: '#FFFFFF',
  width: 90,
  height: 90,
  borderRadius: 1.25,
  left: 0,
  top: 0,
};
const myOrderCardImgStyle = {
  position: 'absolute',
  border: '1px solid #F5F5F5',
  background: '#FFFFFF',
  width: 71.91,
  height: 71.91,
  borderRadius: 1.25,
  left: 0,
  top: 8.09,
};
const myOrderBackGroundCardStyle = {
  position: 'absolute',
  borderWidth: '1px 1px 0 0',
  borderStyle: 'solid',
  borderColor: '#EEEEEE',
  width: 71.91,
  height: 71.91,
  borderRadius: 1.25,
};
