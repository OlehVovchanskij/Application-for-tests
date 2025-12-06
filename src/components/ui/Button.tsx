import { FC } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	text: string
	className?: string
	colorType?: 'default' | 'delete'
}
export const Button: FC<ButtonProps> = ({
	className,
	text,
	colorType = 'default',
	...props
}: ButtonProps) => {
	return (
		<button
			{...props}
			className={` cursor-pointer hover:text-indigo-600 hover:bg-white transition-all duration-500 bg-indigo-600  text-white font-bold border-2 rounded-lg ${className} ${
				colorType === 'delete' ? 'bg-red-600  hover:text-red-600' : ''
			}`}
		>
			{text}
		</button>
	)
}

export default Button
