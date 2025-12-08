import { FC } from 'react'
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	text: string
	className?: string
	colorType?: 'default' | 'delete' | 'gray'
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
			className={` cursor-pointer  hover:bg-white transition-all duration-500   text-white font-bold border-2 rounded-lg
				${
					colorType === 'gray'
						? 'bg-gray-500 hover:text-gray-600'
						: colorType === 'delete'
						? 'bg-red-600  hover:text-red-600'
						: 'hover:text-indigo-600 bg-indigo-600'
				} 
				${className}
			`}
		>
			{text}
		</button>
	)
}

export default Button
