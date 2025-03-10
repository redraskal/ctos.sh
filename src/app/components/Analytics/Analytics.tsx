import Script from 'next/script';

const dev = process.env.NODE_ENV === 'development';
const insightsSrc = dev ? 'https://va.vercel-scripts.com/v1/script.debug.js' : '/science/script.js';
const vitalsSrc = dev ? 'https://va.vercel-scripts.com/v1/speed-insights/script.debug.js' : '/perf/script.js';

export default function Analytics() {
  return (
    <>
      <Script src={insightsSrc} data-endpoint="/science" strategy="lazyOnload" async />
      <Script src={vitalsSrc} data-endpoint="/perf/vitals" strategy="lazyOnload" async />
    </>
  );
}
