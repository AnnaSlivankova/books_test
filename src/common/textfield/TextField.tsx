import {
  ChangeEvent,
  DetailedHTMLProps, FC,
  InputHTMLAttributes,
  KeyboardEvent,
  ReactNode,
} from 'react';
import s from './TextField.module.scss'

const TextField: FC<TextFieldProps> = (props) => {
  const {
    onChange,
    onChangeText,
    onKeyPress,
    onEnter,
    error,
    className,
    spanClassName,
    id,
    ...restProps
  } = props

  const onChangeCallback = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e)
    onChangeText?.(e.currentTarget.value)
  }
  const onKeyPressCallback = (e: KeyboardEvent<HTMLInputElement>) => {
    onKeyPress?.(e)
    onEnter && e.key === 'Enter' && onEnter()
  }

  const finalSpanClassName = s.error
    + (spanClassName ? ' ' + spanClassName : '')

  const finalInputClassName = s.input
    + (error ? ' ' + s.errorInput : ' ' + s.input)
    + (className ? ' ' + className : '')

  return (
    <div className={s.inputWrapper}>
      <input
        id={id}
        type={'text'}
        onChange={onChangeCallback}
        onKeyPress={onKeyPressCallback}
        className={finalInputClassName}
        {...restProps}
      />
      <span
        id={id ? id + '-span' : undefined}
        className={finalSpanClassName}
      >
                {error}
            </span>
    </div>
  );
};

export default TextField;

type DefaultInputProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement>

type  TextFieldProps = Omit<DefaultInputProps, 'type'> & {
  onChangeText?: (value: string) => void
  onEnter?: () => void
  error?: ReactNode
  spanClassName?: string
}