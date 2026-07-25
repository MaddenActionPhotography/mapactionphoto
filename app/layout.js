import "./globals.css";

export const metadata = {
  title: "Madden Action Photography — Today's Game. Tomorrow's Memory.",
  description:
    "Professional action photography and custom digital athlete artwork for youth and adult athletes across the Portland & Vancouver metro. 100% digital delivery.",
  metadataBase: new URL("https://www.madactionphotos.com"),
  openGraph: {
    title: "Madden Action Photography",
    description:
      "Today's Game. Tomorrow's Memory. Action photography & custom athlete artwork — Portland & Vancouver metro.",
    url: "https://www.madactionphotos.com",
    siteName: "Madden Action Photography",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Barlow:wght@400;500;600&family=Barlow+Condensed:wght@500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
