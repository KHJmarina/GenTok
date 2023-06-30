import { Icon } from '@iconify/react';
import { Box } from '@mui/material';
// @mui
import { styled } from '@mui/material/styles';
import { Accept, DropzoneOptions, useDropzone } from 'react-dropzone';

import album_imm from '../../../assets/images/album.svg';
// ----------------------------------------------------------------------

const DropZoneStyle = styled('div')(({ theme }) => ({
  outline: 'none',
  textAlign: 'center',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 20,
  // marginTop: '10px',
  display: 'flex',

  // padding: theme.spacing(5, 1),
  // display: 'inline',
  // flexDirection: 'row',
  // borderRadius: 50,
  // color: theme.palette.grey[400],
  '&:hover': { opacity: 0.72, cursor: 'pointer' },
  [theme.breakpoints.up('md')]: { textAlign: 'left', flexDirection: 'row' },
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
  accept?: any;
  width?: any;
  height?: any;
  showFileIcon: boolean;
  children?: React.ReactNode;
  // onRemove: (file: File) => void;
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
export default function ProfileFileUpload({
  error,
  showPreview = false,
  files,
  width = '100%',
  height = '100%',
  showFileIcon = false,
  maxLen = 100,
  children,
  ...other
}: Props) {
  // const hasFile = files.length > 0;

  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    ...other,
    accept: {
      'image/*': [],
    },
  });

  return (
    <DropZoneStyle
      {...getRootProps()}
      sx={{
        ...(isDragActive && { opacity: 0.72 }),
        ...((isDragReject || error) && {
          color: 'error.main',
          borderColor: 'error.light',
          bgcolor: 'error.lighter',
          height: height,
          width: 500,
        }),
      }}
    >
      <input {...getInputProps()} multiple={false} />
      <Box component={'img'} src={album_imm} width={20} height={20} />
      {children}
    </DropZoneStyle>
  );
}
