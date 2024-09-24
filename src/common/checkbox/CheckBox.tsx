import {
  ChangeEvent,
  DetailedHTMLProps,
  InputHTMLAttributes, FC
} from 'react'
import s from './CheckBox.module.scss'

const CheckBox: FC<CheckBoxProps> = (props) => {
  const {
    onChange,
    onChangeChecked,
    className,
    spanClassName,
    children,
    id,
    ...restProps
  } = props

  const onChangeCallback = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e)
    onChangeChecked?.(e.currentTarget.checked)
  }

  const finalInputClassName = s.checkbox
    + (className ? ' ' + className : '')

  return (
    <label className={s.label}>
      <input
        id={id}
        type='checkbox'
        onChange={onChangeCallback}
        className={finalInputClassName}
        {...restProps}
      />
      {
        children && (<span id={id ? id + '-span' : undefined} className={s.spanClassName}>{children}</span>)
      }
    </label>
  );
};

export default CheckBox;

type DefaultInputProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement>

type CheckBoxProps = Omit<DefaultInputProps, 'type'> & {
  onChangeChecked?: (checked: boolean) => void
  spanClassName?: string
}