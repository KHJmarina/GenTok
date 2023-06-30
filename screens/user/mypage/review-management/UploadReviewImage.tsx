import { Icon } from '@iconify/react';
import { Box, useTheme } from '@mui/material';
// @mui
import { styled } from '@mui/material/styles';
import { Accept, DropzoneOptions, useDropzone } from 'react-dropzone';
import { pxToRem } from 'src/theme/typography';
// utils

// ----------------------------------------------------------------------

const DropZoneStyle = styled('div')(({ theme }) => ({
  cursor: 'pointer',
  borderRadius: 5,
  border: '1px dashed #e5e5e5',
  minWidth: 100,
  minHeight: 100,
  overflow: 'hidden',
  textAlign: 'center',
}));

// ----------------------------------------------------------------------

interface CustomFile extends File {
  path?: string;
  preview?: string;
}

const getFileData = (file: CustomFile) => {
  return {
    key: file.name,
    name: file.name,
    size: file.size,
    preview: file.preview,
  };
};

interface Props extends DropzoneOptions {
  error?: boolean;
  files: File[];
  showPreview: boolean;
  width?: any;
  height?: any;
}
/**
 * (Component) 데이터 전처리 화면 파일 업로드
 *
 * @description 데이터 전처리 화면의 파일 분석 후 파일 임시 저장 부분
 * @parent_component_link {@link UploadDataSetUpload}
 * @layer upload-dataset[2]
 * @author Kimminnyeon
 *
 * @param error 파일 임시 저장 시에 에러 발생 여부
 * @param showPreview 파일 미리보기(only Image)
 * @param files 임시 저장된 fileList
 * @function onRemove file 삭제 시 callback fuc
 * @param path 해당 파일 임시 저장 경로
 * @param preview 미리보기 시 파일 이름
 * @param acceptType 파일 확장자
 *
 */
export default function FileUpload({
  error,
  showPreview = false,
  files,
  width = '100%',
  height = '100%',
  ...other
}: Props) {
  const theme = useTheme();

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    ...other,
    accept: {
      'image/jpeg': [],
      'image/jpg': [],
      'image/png': [],
      'image/heic': []
    }
  });

  return (
    <Box
      sx={{
        width: width,
        display: 'flex',
        mr: pxToRem(8),
      }}
    >
      <DropZoneStyle
        {...getRootProps()}
        sx={{
          ...(isDragActive && { opacity: 0.72 }),
          ...((isDragReject || error) && {
            color: 'error.main',
            borderColor: 'error.light',
            bgcolor: 'error.lighter',
            height: height,
          }),
        }}
      >
        <input {...getInputProps()} />

        <Icon
          icon='ic:round-plus'
          style={{
            position: 'relative',
            transform: 'translateY(150%)',
            fontSize: theme.typography.pxToRem(25)
          }}
        />
      </DropZoneStyle>
    </Box>
  );
}
