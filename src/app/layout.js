import { Poppins } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
	weight: ['300', '400', '500', '600', '700', '800'],
	subsets: ['latin'],
	variable: '--font-poppins'
});

export const metadata = {
	title: 'Sportsee',
	description: 'Le dashboard de sport'
};

export default function RootLayout({ children }) {
	return (
		<html lang="fr" className={poppins.variable}>
			<body>{children}</body>
		</html>
	);
}
