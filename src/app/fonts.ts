import localFont from "next/font/local";

export const inter = localFont({
	src: [
		{
			path: "../../public/fonts/InterVariable.woff2",
			style: "normal",
		},
		{
			path: "../../public/fonts/InterVariable-Italic.woff2",
			style: "italic",
		},
	],
	variable: "--font-inter",
	fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export const berkeleyMono = localFont({
	src: "../../public/fonts/TX-02-Variable.woff2",
	variable: "--font-tx-02",
	fallback: ["ui-monospace", "monospace"],
});
