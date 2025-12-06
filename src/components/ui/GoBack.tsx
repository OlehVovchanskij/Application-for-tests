import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { RoutesConfig } from '../../config/PagesConfig'
interface GoBackProps {
	className?: string
	color?: string
}
export const GoBack = ({ className, color = 'black' }: GoBackProps) => {
	return (
		<Link
			to={RoutesConfig.HOME}
			className={`flex items-center group cursor-pointer mb-3 ${className}`}
		>
			<ArrowLeft
				className={`cursor-pointer transition-colors duration-300 group-hover:text-indigo-600   mr-2 text-${color}`}
				width={36}
				height={36}
			/>
			<p
				className={`group-hover:text-indigo-600 transition-colors duration-300 	font-semibold text-${color}`}
			>
				Назад
			</p>
		</Link>
	)
}
