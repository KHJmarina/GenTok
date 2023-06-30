import { Autocomplete, FormHelperText, TextField, Tooltip } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

export interface selectOptions {
  code?: string | number | boolean | null;
  pcode?: string | number | null;
  value: string;
}
export const defaultOption: selectOptions = {
  code: '',
  pcode: '',
  value: '선택',
};
interface CSelectdProps {
  /** **라벨** */
  label: string;
  /** ** 리액트 훅 폼 필드명** */
  name: string;
  /** **옵션** */
  options: selectOptions[];
  /** **입력 도움말** */
  placeholder?: string;
  /** **비활성화 여부** */
  disabled?: boolean;
  /** **수정금지 여부** */
  readonly?: boolean;
  /** **코드 데이터 여부**  */
  code?: boolean;
  /** **체인지 콜백** */
  onChangeCallback?: Function;
  /** **Enter 키 Callback 함수**  */
  onEnterCallback?: Function;
  /** use help text */
  help?: boolean;
  variant?: 'standard' | 'filled' | 'outlined' | undefined;
  defaults?: selectOptions;
}

/**
 * ## 기본 사용법
 *
 * > 단일 값을 입력하는 셀렉트 박스입니다.
 *
 */
const CSelect = observer(function CSelectdProps({
  name,
  label,
  options,
  placeholder = '',
  disabled = false,
  readonly = false,
  code = false,
  onChangeCallback,
  onEnterCallback,
  help = true,
  defaults = defaultOption,
  variant = 'standard',
  ...other
}: CSelectdProps) {
  const { control } = useFormContext();
  const [open, setOpen] = React.useState(false);

  if (options.length > 0) {
    if (defaults) {
      options = options.concat(defaults).reverse();
    }
    //  else {
    //   options = options.concat(defaultOption).reverse();
    // }
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => {
        if (code && !value) {
          value = defaultOption;
        }
        return (
          <FormControl sx={{ width: '100%' }} className={readonly === true ? 'view' : ''}>
            <Tooltip
              arrow
              title={options.filter((opt) => opt.code === value)[0]?.value || ''}
              followCursor={false}
              placement={'top'}
            >
              <Autocomplete
                size="small"
                options={options}
                fullWidth
                getOptionLabel={(option) => option.value}
                onBlur={onBlur}
                value={
                  code
                    ? value
                      ? value
                      : ''
                    : options.filter((option) => option.code === value)[0]
                    ? options.filter((option) => option.code === value)[0]
                    : defaults || defaultOption
                }
                defaultValue={code ? defaultOption : defaultOption.value}
                onChange={(e, options) => {
                  onChange({ target: { name, value: code ? options : options?.code } });
                  onChangeCallback &&
                    onChangeCallback({ target: { name, value: code ? options : options?.code } });
                }}
                disableClearable={readonly}
                open={open}
                onOpen={() => !readonly && setOpen(true)}
                onClose={() => setOpen(false)}
                onKeyUp={(e) => {
                  if (e.keyCode === 13) {
                    onEnterCallback && onEnterCallback();
                  }
                }}
                isOptionEqualToValue={
                  code ? (option) => option === value : (option) => option.code === value
                }
                forcePopupIcon={readonly === true ? false : 'auto'}
                renderInput={(params) => (
                  <>
                    <TextField
                      {...params}
                      variant={variant}
                      label={label}
                      placeholder={placeholder}
                      InputProps={{ ...params.InputProps, readOnly: readonly }}
                      disabled={disabled}
                      error={!!error}
                      {...other}
                      sx={{ fontSize: '0.5rem' }}
                    />
                    {help === true && (
                      <FormHelperText error variant="filled" sx={{ marginTop: '0' }}>
                        {error?.message}
                      </FormHelperText>
                    )}
                  </>
                )}
              />
            </Tooltip>
          </FormControl>
        );
      }}
    />
  );
});

export default CSelect;
