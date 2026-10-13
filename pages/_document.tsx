import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" style={{ backgroundColor: '#fdf9f0' }}>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Cairo:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" type="image/png" href="/images/logo.png" />
        <link rel="apple-touch-icon" href="/images/logo.png" />
        <style dangerouslySetInnerHTML={{ __html: `
          html, body {
            overflow-x: hidden;
            max-width: 100%;
            background-color: #ffffff;
            color: #333333;
            margin: 0;
            padding: 0;
            font-family: 'Poppins', 'Cairo', sans-serif;
          }
          html.dark, html.dark body {
            background-color: #0b1a13;
            color: #e6f4ec;
          }
        ` }} />
      </Head>
      <body className="font-sans bg-background text-on-surface">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

