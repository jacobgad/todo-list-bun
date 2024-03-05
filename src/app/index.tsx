import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Todo list API",
	description: "Author: Jacob Gad",
};

export default function Home() {
	return (
		<html lang="en">
			<body>
				<h1>Todo list API</h1>
			</body>
		</html>
	);
}
