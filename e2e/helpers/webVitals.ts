import { Page } from '@playwright/test';


declare global {
    interface Window {
        webVitals: {
            getCLS(arg0: (metric: any) => void): unknown;
            getINP(arg0: (metric: any) => void): unknown;
            getTTFB(arg0: (metric: any) => void): unknown;
            getFCP(arg0: (metric: any) => void): unknown;
            getLCP(arg0: (metric: any) => void): unknown;
            onTTFB(arg0: (m: any) => void): unknown;
            onLCP(arg0: (m: any) => void): unknown;
            onINP(arg0: (m: any) => void): unknown;
            onFCP(arg0: (m: any) => void): unknown;
            onCLS(arg0: (m: any) => void): unknown;
            // getLCP: (cb: (metric: { value: number }) => void) => void;
            // getFCP: (cb: (metric: { value: number }) => void) => void;
            // getTTFB: (cb: (metric: { value: number }) => void) => void;
            // Add other metrics if needed
        };
        __webVitalsRecords?: Array<any>;
        __webVitalsListenersAttached?: boolean;
        collectVitalsForEvent?: (eventLabel: string) => void;
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
//     //Inject web-vitals script from CDN
//     await page.addScriptTag({
//         url: 'https://unpkg.com/web-vitals@3/dist/web-vitals.iife.js',
//     });

//     const metrics = await page.evaluate(() => {
//         return new Promise(resolve => {
//             let results = { LCP: -1, FCP: -1, TTFB: -1, INP: -1, CLS: -1 };
//             window.webVitals.getLCP(metric => { results.LCP = metric.value; });
//             window.webVitals.getFCP(metric => { results.FCP = metric.value; });
//             window.webVitals.getTTFB(metric => { results.TTFB = metric.value; });
//             window.webVitals.getINP(metric => { results.INP = metric.value; });
//             window.webVitals.getCLS(metric => { results.CLS = metric.value; });
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
        //console.log(`${name} valid: ${good}`);
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
                function recordMetric(name, m) {
                    checkMetric(m);
                    const lastEntry = m.entries && m.entries.length ? m.entries[m.entries.length - 1] : null;
                    const element = lastEntry && lastEntry.element ? lastEntry.element : null;
                    const elementInfo = element
                        ? {
                            tag: element.tagName,
                            id: element.id,
                            classes: element.className,
                            textContent: element.textContent?.trim().substring(0, 100)
                        }
                        : null;
                    const entry = {
                        url: window.location.href,
                        name,
                        value: m.value,
                        rating: m.rating,
                        timestamp: Date.now(),
                        element: elementInfo
                    };
                    (window.__webVitalsRecords = window.__webVitalsRecords || []).push(entry);
                    console.log(`[${window.location.href}] ${name}: value=${m.value}, rating=${m.rating}`);

                }
                // function collectVitalsForEvent(eventLabel) {
                //     const results = { url: location.href, event: eventLabel, LCP: null, FCP: null, CLS: null, INP: null, TTFB: null };
                //     let doneCount = 0;
                //     const checkDone = () => {
                //         if (++doneCount === 5) {
                //             console.log(`[WebVitals] Collected for ${eventLabel} on ${location.href}`, results);
                //             (window.__webVitalsRecords = window.__webVitalsRecords || []).push({ ...results, timestamp: Date.now() });
                //         }
                //     };

                //     window.webVitals.onLCP(m => { 
                //         results.LCP = m.value; 
                //         checkDone(); 
                //         if(m.element) {
                //             console.log(`[WebVitals] LCP element on ${location.href}:`, {
                //                 tag: m.element.tagName,
                //                 id: m.element.id,
                //                 classes: m.element.className,
                //                 textContent: m.element.textContent?.trim().substring(0, 100)
                //             });
                //         }
                //     });
                //     window.webVitals.onFCP(m => { 
                //         results.FCP = m.value; 
                //         checkDone(); 
                //         // FCP does not have an element property
                //         console.log(`[WebVitals] FCP for ${eventLabel} on ${location.href}: value=${m.value}, rating=${m.rating}`);
                //     });
                //     window.webVitals.onCLS(m => { results.CLS = m.value; checkDone(); });
                //     window.webVitals.onINP(m => { results.INP = m.value; checkDone(); });
                //     window.webVitals.onTTFB(m => { results.TTFB = m.value; checkDone(); });
                // }

                // // Expose to window so you can call from Playwright
                // window.collectVitalsForEvent = collectVitalsForEvent;
                function startWebVitalsCollection() {
                    if (window.__webVitalsListenersAttached) return; // Prevent multiple attachments
                    window.__webVitalsListenersAttached = true;
                    window.webVitals.onCLS(m => recordMetric('CLS', m));
                    window.webVitals.onFCP(m => recordMetric('FCP', m));
                    window.webVitals.onINP(m => recordMetric('INP', m));
                    window.webVitals.onLCP(m => recordMetric('LCP', m));
                    window.webVitals.onTTFB(m => recordMetric('TTFB', m));
                    console.log("Initialized web vital monitors");
                }

                // Hook SPA navigations
                const _pushState = history.pushState;
                history.pushState = function (...args) {
                    _pushState.apply(this, args);
                    setTimeout(startWebVitalsCollection, 0);
                };

                const _replaceState = history.replaceState;
                history.replaceState = function (...args) {
                    _replaceState.apply(this, args);
                    setTimeout(startWebVitalsCollection, 0);
                };

                window.addEventListener('popstate', () => {
                    setTimeout(startWebVitalsCollection, 0);
                });

                // Start collection on initial load
                startWebVitalsCollection();
                // window.webVitals.onCLS(m => recordMetric('CLS', m));
                // window.webVitals.onFCP(m => recordMetric('FCP', m));
                // window.webVitals.onINP(m => recordMetric('INP', m));
                // window.webVitals.onLCP(m => recordMetric('LCP', m));
                // window.webVitals.onTTFB(m => recordMetric('TTFB', m));
                // // window.webVitals.onCLS(checkMetric);
                // // window.webVitals.onFCP(checkMetric);
                // // window.webVitals.onINP(checkMetric);
                // // window.webVitals.onLCP(checkMetric);
                // // window.webVitals.onTTFB(checkMetric);
                // //  window.webVitals.onCLS(m => console.log(`[${window.location.href}] CLS: value=${m.value}, rating=${m.rating}`));
                // //  window.webVitals.onFCP(m => console.log(`[${window.location.href}] FCP: value=${m.value}, rating=${m.rating}`));
                // //  window.webVitals.onINP(m => console.log(`[${window.location.href}] INP: value=${m.value}, rating=${m.rating}`));
                // //  window.webVitals.onLCP(m => console.log(`[${window.location.href}] LCP: value=${m.value}, rating=${m.rating}`));
                // //  window.webVitals.onTTFB(m => console.log(`[${window.location.href}] TTFB: value=${m.value}, rating=${m.rating}`));
                // console.log("Initialized web vital monitors");
            });
        },
        [scriptBody]
    );

    const [navTiming] = await page.evaluate(() =>
        window.performance.getEntriesByType("navigation").map((e) => e.toJSON())
    );
    // At the end of your test
    const vitals = await page.evaluate(() => window.__webVitalsRecords || []);
    console.log("Collected web vitals:", vitals);
    // const reportPath = path.join(__dirname, `../web-vitals-${Date.now()}.json`);
    // fs.writeFileSync(reportPath, JSON.stringify(vitals, null, 2));
    // console.log(`Web Vitals report written to ${reportPath}`);
    //console.debug("Navigation Entry:", navTiming);
    //console.log(badMetrics)
    console.log("Page load time:", navTiming.loadEventEnd);
}



// webVitals.ts
// import fs from 'fs';
// import path from 'path';
// import { Page } from 'playwright';

// export async function setupWebVitals(page: Page, badMetricG: string[]) {
//     console.log('Setting up web vitals collection...');
//   // Expose validation function if you still want to filter bad metrics
//   await page.exposeFunction('validateMetric', (name: string, good: boolean) => {
//     return true; // Keep for backward compatibility
//   });

//   // Inject a script into the browser context
//   await page.addScriptTag({
//     url: 'https://unpkg.com/web-vitals@3/dist/web-vitals.iife.js'
//   });

//   await page.evaluate(() => {
//     // Keep a global array of all captured metrics by URL
//     (window as any).__webVitalsRecords = [];

//     // Utility to start listeners for current page view
//     function startWebVitalsCollection() {
//         console.log('[WebVitals] Starting collection for', location.href);
//       const results: any = { url: location.href, LCP: null, FCP: null, CLS: null, INP: null, TTFB: null };
//       let doneCount = 0;

//       const checkDone = () => {
//         if (++doneCount === 5) {
//           console.log('[WebVitals] Collected for', location.href, results);
//           (window as any).__webVitalsRecords.push(results);
//         }
//       };

//       console.log('[WebVitals] Starting collection for', location.href);
//       (window as any).webVitals.getLCP(m => { results.LCP = m.value; checkDone(); });
//       (window as any).webVitals.getFCP(m => { results.FCP = m.value; checkDone(); });
//       (window as any).webVitals.getCLS(m => { results.CLS = m.value; checkDone(); });
//       (window as any).webVitals.getINP(m => { results.INP = m.value; checkDone(); });
//       (window as any).webVitals.getTTFB(m => { results.TTFB = m.value; checkDone(); });
//     }

//     // Hook SPA navigations
//     const _pushState = history.pushState;
//     history.pushState = function (...args) {
//       _pushState.apply(this, args);
//       setTimeout(startWebVitalsCollection, 0);
//     };

//     const _replaceState = history.replaceState;
//     history.replaceState = function (...args) {
//       _replaceState.apply(this, args);
//       setTimeout(startWebVitalsCollection, 0);
//     };

//     window.addEventListener('popstate', () => {
//       setTimeout(startWebVitalsCollection, 0);
//     });

//     // Start collection on initial load
//     startWebVitalsCollection();
//   });
// }

// // Call this at the end of your test to save metrics
// export async function saveWebVitals(page: Page, fileName = 'web-vitals-report.json') {
//   const records = await page.evaluate(() => (window as any).__webVitalsRecords || []);
//   console.log('Collected web vitals:', records);
//   const reportPath = path.join(process.cwd(), fileName);
//   fs.writeFileSync(reportPath, JSON.stringify(records, null, 2));
//   console.log(`✅ Web Vitals report written to ${reportPath}`);
// }
