import { Page } from '@playwright/test';


declare global {
    interface Window {
        webVitals: {
            onTTFB(arg0: (m: any) => void): unknown;
            onLCP(arg0: (m: any) => void): unknown;
            onINP(arg0: (m: any) => void): unknown;
            onFCP(arg0: (m: any) => void): unknown;
            onCLS(arg0: (m: any) => void): unknown;
            getLCP: (cb: (metric: { value: number }) => void) => void;
            getFCP: (cb: (metric: { value: number }) => void) => void;
            getTTFB: (cb: (metric: { value: number }) => void) => void;
            // Add other metrics if needed
        };
    }
}

// export async function addInitSctipt(page: Page) {
//     // Inject web-vitals script from CDN
//     await page.addScriptTag({
//         url: 'https://unpkg.com/web-vitals@3/dist/web-vitals.iife.js',
//     });
// }

// Inject web-vitals script and collect metrics
// export async function collectWebVitals(page: Page) {
//     // Inject web-vitals script from CDN
//     await page.addScriptTag({
//         url: 'https://unpkg.com/web-vitals@3/dist/web-vitals.iife.js',
//     });

//     const vitals = await page.evaluate(async () => {
//         // @ts-ignore
//         const { getLCP, getFCP, getTTFB } = window.webVitals;
//         const results: Record<string, number> = {};

//         // Use Promise.race for each metric (optionally add a timeout)
//         results.LCP = await Promise.race([
//             new Promise<number>(resolve => getLCP((m: any) => resolve(m.value))),
//             new Promise<number>(resolve => setTimeout(() => resolve(-1), 5000)), // optional timeout
//         ]);
//         results.FCP = await Promise.race([
//             new Promise<number>(resolve => getFCP((m: any) => resolve(m.value))),
//             new Promise<number>(resolve => setTimeout(() => resolve(-1), 5000)),
//         ]);
//         results.TTFB = await Promise.race([
//             new Promise<number>(resolve => getTTFB((m: any) => resolve(m.value))),
//             new Promise<number>(resolve => setTimeout(() => resolve(-1), 5000)),
//         ]);

//         return results;
//     });

//     const url = page.url();
//     console.log(`Web Vitals for ${url}:`, vitals);
//     return vitals;
// }

// export async function collectWebVitals1(page: Page) {
//     // Inject web-vitals script from CDN
//     // await page.addScriptTag({
//     //     url: 'https://unpkg.com/web-vitals@3/dist/web-vitals.iife.js',
//     // });

//     const metrics = await page.evaluate(() => {
//         return new Promise(resolve => {
//             let results = { LCP: -1, FCP: -1, TTFB: -1 };
//             window.webVitals.getLCP(metric => { results.LCP = metric.value; });
//             window.webVitals.getFCP(metric => { results.FCP = metric.value; });
//             window.webVitals.getTTFB(metric => { results.TTFB = metric.value; });
//             setTimeout(() => resolve(results), 3000); // Wait a bit for metrics to be collected
//         });
//     });

//     console.log(`Web Vitals for ${page.url()}:`, metrics);
//     return metrics;
// }
import fs from 'fs';
import path from 'path';
// Function to set up web vitals collection
export async function setupWebVitals(page: Page, badMetrics: string[]) {
  function validateMetric(name: string, good: boolean) {
    console.log(`${name} valid: ${good}`);
    if (!good) {
      badMetrics.push(name);
    }
  }
  await page.exposeFunction("validateMetric", validateMetric);

  const scriptPath = path.join(__dirname, '../../node_modules/web-vitals/dist/web-vitals.iife.js');
  const scriptBody = fs.readFileSync(scriptPath, 'utf8');

  await page.addInitScript(
    ([scriptBody]) => {
      window.addEventListener("DOMContentLoaded", () => {
        const script = document.createElement("script");
        script.text = scriptBody;
        try {
          document.head.appendChild(script);
        } catch (e) {
          console.error("Error when initializing injected CWV script");
          console.error(e);
        }
        function checkMetric(m) {
          console.log(`${m.name}: value=${m.value}, rating=${m.rating}`);
          if (m.rating !== "good") {
            window.validateMetric(m.name, false);
            return;
          }
          window.validateMetric(m.name, true);
        }
        // window.webVitals.onCLS(checkMetric);
        // window.webVitals.onFCP(checkMetric);
        // window.webVitals.onINP(checkMetric);
        // window.webVitals.onLCP(checkMetric);
        // window.webVitals.onTTFB(checkMetric);
         window.webVitals.onCLS(m => console.log(`[${window.location.href}] CLS: value=${m.value}, rating=${m.rating}`));
         window.webVitals.onFCP(m => console.log(`[${window.location.href}] FCP: value=${m.value}, rating=${m.rating}`));
         window.webVitals.onINP(m => console.log(`[${window.location.href}] INP: value=${m.value}, rating=${m.rating}`));
         window.webVitals.onLCP(m => console.log(`[${window.location.href}] LCP: value=${m.value}, rating=${m.rating}`));
         window.webVitals.onTTFB(m => console.log(`[${window.location.href}] TTFB: value=${m.value}, rating=${m.rating}`));
        console.log("Initialized web vital monitors");
      });
    },
    [scriptBody]
  );
}