function MainLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className='h-screen overflow-hidden flex flex-col w-full '>
			<main className=' h-[95%]'>{children}</main>
			<footer className='bg-zinc-600 flex items-center justify-center text-white p-4 text-xl h-[5%] font-bold text-center'>
				&copy; 2025 Tests App | Developed by Oleg
			</footer>
		</div>
	)
}

export default MainLayout
