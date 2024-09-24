import {ButtonHTMLAttributes, DetailedHTMLProps, FC} from 'react'
import s from './Button.module.scss'

const Button: FC<ButtonProps> = (props) => {
  const {
    xType,
    className,
    disabled,
    ...restProps
  } = props

  const finalClassName = s.button
    + (disabled ? ` ${s.disabled}` : ' ') +
    (xType === 'red' ? ` ${s.red}` :
      xType === 'secondary' ? ' ' + s.secondary :
        ' ' + s.default)

  return (
    <button
      disabled={disabled}
      className={finalClassName}
      {...restProps}
    />
  );
};

export default Button;

type DefaultButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement>

type ButtonProps = DefaultButtonProps & {
  xType?: string
}