import { FC, InputHTMLAttributes } from 'react'

export const Field: FC<InputHTMLAttributes<HTMLInputElement>> = ({
	className,
	...props
}) => {
	return <input className={`text-white ${className}`} {...props} />
}
