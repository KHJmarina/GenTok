import { FormControl, FormControlLabel, FormHelperText, Switch, SxProps, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { Controller, useFormContext } from 'react-hook-form';
import { Theme } from '@mui/material/styles';

interface CSwitchProps {
  /** **라벨** */
  label: string;
  /** ** 리액트 훅 폼 필드명** */
  name: string;
  /** **비활성화 여부** */
  disabled?: boolean;
  /** **수정금지 여부** */
  readonly?: boolean;
  /** **변경 함수** */
  onChangeCallback?: (e: any) => void;
  /** **수정금지 여부** */
  justifyContent?: string;
  sx?: SxProps<Theme>;
  size?: 'small' | 'medium' | undefined;
  defaultValue?: boolean | any;
}

/**checkSwitch
 * ## 기본 사용법
 *
 * > 스위치
 *
 */
const AlarmSwitch = observer(function CSwitchProps({
  label,
  name,
  disabled = false,
  readonly = false,
  onChangeCallback,
  // justifyContent = 'flex-end',
  sx,
  size = 'small',
  defaultValue = false,
}: CSwitchProps) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => {
        if (value === undefined) {
          // setValue(name, false);
          value = false;
        }
        return (
          <FormControl sx={sx}>
            <FormControlLabel
              disabled={disabled}
              sx={{
                ml: 0,
                pt: 1,
                pr: 2,

                justifyContent: 'space-between',
                width: '100%',
              }}
              labelPlacement="start"
              control={
                <Switch
                  size={size}
                  readOnly={readonly}
                  onBlur={onBlur}
                  checked={value}
                  onChange={(e) => {
                    onChange({ target: { name, value: readonly ? value : !value } });
                    onChangeCallback &&
                      onChangeCallback({ target: { name, value: readonly ? value : !value } });
                  }}
                  sx={{ justifyContent: 'flex-end' }}
                />
              }
              label={label}
            />
            <FormHelperText error>{error?.message}</FormHelperText>
          </FormControl>
        );
      }}
    />
  );
});

export default AlarmSwitch;
