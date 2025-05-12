import './globals.css'; 


export const metadata = {
  title: "Code Section",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
