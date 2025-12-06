interface CheckboxProps {
	checked: boolean
	onChange: () => void
}

export const Checkbox = ({ checked, onChange }: CheckboxProps) => (
	<label className='flex items-center gap-2 cursor-pointer'>
		<input
			type='checkbox'
			checked={checked}
			onChange={onChange}
			className='peer sr-only'
		/>
		<div
			className='
			w-5 h-5 rounded
			border border-white/40
			flex items-center justify-center
			peer-checked:bg-indigo-600
			peer-checked:border-indigo-600
			transition
		'
		>
			<svg
				viewBox='0 0 24 24'
				className='w-4 h-4 text-white scale-0 peer-checked:scale-100 transition'
				fill='none'
				stroke='currentColor'
				strokeWidth='3'
			>
				<path d='M5 13l4 4L19 7' />
			</svg>
		</div>
	</label>
)
