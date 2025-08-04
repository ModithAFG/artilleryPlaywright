import { Page } from '@playwright/test';

// Inject web-vitals script and collect metrics
export async function collectWebVitals(page: Page) {
    // Inject web-vitals script from CDN
    await page.addScriptTag({
        url: 'https://unpkg.com/web-vitals@3/dist/web-vitals.iife.js',
    });

    const vitals = await page.evaluate(async () => {
        // @ts-ignore
        const { getLCP, getFCP, getTTFB } = window.webVitals;
        const results: Record<string, number> = {};

        // Use Promise.race for each metric (optionally add a timeout)
        results.LCP = await Promise.race([
            new Promise<number>(resolve => getLCP((m: any) => resolve(m.value))),
            new Promise<number>(resolve => setTimeout(() => resolve(-1), 5000)), // optional timeout
        ]);
        results.FCP = await Promise.race([
            new Promise<number>(resolve => getFCP((m: any) => resolve(m.value))),
            new Promise<number>(resolve => setTimeout(() => resolve(-1), 5000)),
        ]);
        results.TTFB = await Promise.race([
            new Promise<number>(resolve => getTTFB((m: any) => resolve(m.value))),
            new Promise<number>(resolve => setTimeout(() => resolve(-1), 5000)),
        ]);

        return results;
    });

    const url = page.url();
    console.log(`Web Vitals for ${url}:`, vitals);
    return vitals;
}