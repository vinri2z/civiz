import "./globals.css";

export const metadata = {
  title: "Vincent Rizzo - Senior Data Scientist · AI Engineer",
  description:
    "Vincent Rizzo - ML & AI engineer building GenAI and LLM applications over large regulatory and corporate text. Selected projects, experience and stack.",
};

export const viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
