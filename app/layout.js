import "./globals.css";

export const metadata = {
  title: "Prompts Hub",
  description: "Copy and paste practical prompts for ChatGPT",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50">
        {children}
      </body>
    </html>
  );
}
