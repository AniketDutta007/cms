import { Navbar } from '@/components/navbar';

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<Navbar />
			<main className='w-full grow flex flex-col justify-center items-center'>
				{children}
			</main>
		</>
	);
}
