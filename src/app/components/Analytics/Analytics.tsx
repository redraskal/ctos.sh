import Script from 'next/script';

const dev = process.env.NODE_ENV === 'development';
const src = dev ? 'https://va.vercel-scripts.com/v1/script.debug.js' : '/science/script.js';

export default function Analytics() {
  return (
    <>
      <Script id="va" strategy="afterInteractive">
        {`window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };`}
      </Script>
      <Script src={src} data-endpoint="/science" strategy="lazyOnload" async />
    </>
  );
}
