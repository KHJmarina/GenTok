//
import { Icon } from '@iconify/react';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { DropzoneOptions, useDropzone } from 'react-dropzone';
import { pxToRem } from 'src/theme/typography';

// ----------------------------------------------------------------------

const DropZoneStyle = styled('div')(({ theme }) => ({
  height: pxToRem(100),
  width: pxToRem(100),
  outline: 'none',
  display: 'flex',
  textAlign: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(5, 1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.common.white,
  border: `1px dashed ${theme.palette.grey[400]}`,
  '&:hover': { opacity: 0.72, cursor: 'pointer' },
  [theme.breakpoints.up('md')]: { textAlign: 'left', flexDirection: 'row' },
}));

// ----------------------------------------------------------------------

interface CustomFile extends File {
  path?: string;
  preview?: string;
}

interface Props extends DropzoneOptions {
  error?: boolean;
  files: File[];
  showPreview: boolean;
  accept?: any;
  width?: any;
  height?: any;
  showFileIcon: boolean;
  maxLen?: number;
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
 * @param showFileIcon 파일 아이콘
 *
 */
export default function FileUpload({
  error,
  showPreview = false,
  files,
  width = '100%',
  height = '100%',
  showFileIcon = false,
  maxLen = 100,
  ...other
}: Props) {
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    ...other,
    accept: {
      'image/*': [],
    },
  });
  const theme = useTheme();

  return (
    <DropZoneStyle
      {...getRootProps()}
      sx={{
        ...(isDragActive && { opacity: 0.72, bgcolor: '#ffffff' }),
        ...((isDragReject || error) && {
          color: 'error.main',
          borderColor: theme.palette.grey[500],
          bgcolor: theme.palette.common.white,
          height: height,
          width: width,
        }),
      }}
    >
      <input {...getInputProps()} />
      <Icon icon="ic:round-plus" />
    </DropZoneStyle>
  );
}
