import { test, expect } from '@playwright/test';
import { goToAssertions } from '../helpers/browsePage';
import { ensureLoggedIn, testContactsPage, testHomePage, testopportunities } from '../helpers/loginPage';
import fs from 'fs';
import path from 'path';

// test('test', async ({ page }) => {
//   console.log('Starting ensureLoggedIn');
//   await goToAssertions(page);
// });

test('login with TOTP', async ({ page }) => {
   page.on("console", async (msg) => {
      if (
         msg.type() === "log" ||
         msg.type() === "trace" ||
         msg.type() === "error"
      ) {
         console.log(msg.text());
      }
   });

   const badMetrics: string[] = [];
   await setupWebVitals(page, badMetrics);
   page.on("console", async (msg) => {
      if (
         msg.type() === "log" ||
         msg.type() === "trace" ||
         msg.type() === "error"
      ) {
         console.log(msg.text());
      }
   });
   if (fs.existsSync('storageState.json') && fs.statSync('storageState.json').size > 0) {
      console.log('Starting ensureLoggedIn');

      console.log('Finished ensureLoggedIn, starting testHomePage');
   } else {
      await ensureLoggedIn(page);
      console.log('Storage state already exists and is not empty,  login.');
   }

   await testHomePage(page);
   await page.close();
   console.log('Finished testHomePage');
});


test('check contacts page', async ({ page }) => {
   page.on("console", async (msg) => {
      if (
         msg.type() === "log" ||
         msg.type() === "trace" ||
         msg.type() === "error"
      ) {
         console.log(msg.text());
      }
   });

   const badMetrics: string[] = [];
   await setupWebVitals(page, badMetrics);
   await testContactsPage(page);
   console.log('Finished testContactsPage');
   //await page.close();
});

test('check opportunities page ', async ({ page }) => {

   page.on("console", async (msg) => {
      if (
         msg.type() === "log" ||
         msg.type() === "trace" ||
         msg.type() === "error"
      ) {
         console.log(msg.text());
      }
   });

   const badMetrics: string[] = [];
   await setupWebVitals(page, badMetrics);

   await testopportunities(page);
   console.log('Finished testopportunities');
   await page.close();
});

// test.beforeEach(async ({ page }) => {
//   const scriptPath = path.resolve(__dirname, '../../node_modules/web-vitals/dist/web-vitals.iife.js');
//   const scriptContent = fs.readFileSync(scriptPath, 'utf8');
//   await page.addInitScript({ content: scriptContent });
// });



import type * as webVitals from 'web-vitals';
import { setupWebVitals } from '../helpers/webVitals';


declare global {
   interface Window {

      validateMetric: (name: string, good: boolean) => void;
   }
}

test.describe("HackerNews/newest", () => {

   // Web vitals are collected differently for each browser.
   // Some metrics may be collected inconsistently or not at all.
   test('should have good web vitals', async ({ page }) => {

      // Set up page listeners
      page.on("console", async (msg) => {
         if (
            msg.type() === "log" ||
            msg.type() === "trace" ||
            msg.type() === "error"
         ) {
            console.log(msg.text());
         }
      });

      const badMetrics: string[] = [];
      function validateMetric(name: string, good: boolean) {
         console.log(`${name} valid: ${good}`);
         if (!good) {
            badMetrics.push(name);
         }
      }
      page.exposeFunction("validateMetric", validateMetric);

      // Using classic script to get webVitals global namespace
      const scriptPath = path.join(__dirname, '../../node_modules/web-vitals/dist/web-vitals.iife.js');
      // Read the web-vitals script content at runtime
      const scriptBody = fs.readFileSync(scriptPath, 'utf8');

      /* 
       * Inject the script into the page.
       * Make sure to use the raw script content instead of creating a script with the src set to `webVitalsUrl`.
       * Otherwise, the external script may get blocked on certain websites.
       */
      await page.addInitScript(
         async ([scriptBody]) => {
            window.addEventListener("DOMContentLoaded", async () => {
               const script = document.createElement("script");
               script.text = scriptBody;
               try {
                  document.head.appendChild(script);
               } catch (e) {
                  console.error("Error when initializing injected CWV script");
                  console.error(e);
               }

               // From GoogleChrome/web-vitals:
               // > Note that some of these metrics will not report until the user has interacted with the page,
               // > switched tabs, or the page starts to unload.
               // See: https://github.com/GoogleChrome/web-vitals#:~:text=Note%20that%20some%20of%20these%20metrics%20will%20not%20report%20until%20the%20user%20has%20interacted%20with%20the%20page%2C%20switched%20tabs%2C%20or%20the%20page%20starts%20to%20unload.
               function checkMetric(m: webVitals.Metric) {
                  console.log(`${m.name}: value=${m.value}, rating=${m.rating}`);
                  if (m.rating !== "good") {
                     window.validateMetric(m.name, false);
                     return;
                  }
                  window.validateMetric(m.name, true);
               }

               //  window.webVitals.onCLS(checkMetric);
               //  window.webVitals.onFCP(checkMetric);
               //  window.webVitals.onINP(checkMetric);
               //  window.webVitals.onLCP(checkMetric);
               //  window.webVitals.onTTFB(checkMetric);
               window.webVitals.onCLS(m => console.log(`CLS: value=${m.value}, rating=${m.rating}`));
               window.webVitals.onFCP(m => console.log(`FCP: value=${m.value}, rating=${m.rating}`));
               window.webVitals.onINP(m => console.log(`INP: value=${m.value}, rating=${m.rating}`));
               window.webVitals.onLCP(m => console.log(`LCP: value=${m.value}, rating=${m.rating}`));
               window.webVitals.onTTFB(m => console.log(`TTFB: value=${m.value}, rating=${m.rating}`));
               console.log("Initialized web vital monitors");
            });
         },
         [scriptBody]
      );


      //await page.goto("https://testing.v3.sit.ambitionone.com.au");
      await page.goto("https://playwright.dev/");

      // Page click to record LCP and FID
      await page.waitForLoadState('domcontentloaded');
      console.log("Page click");
      // await page.locator('#page-menu-trigger').click();
      await page.getByRole('link', { name: 'Get started' }).click();

      // Manually obtain navigation event metrics for page load time
      // - NOTE: There is only one PerformanceNavigationTiming object in the performance timeline
      //   See: https://developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigationTiming
      const [navTiming] = await page.evaluate(() =>
         window.performance.getEntriesByType("navigation").map((e) => e.toJSON())
      );
      //console.debug("Navigation Entry:", navTiming);
      console.log("Page load time:", navTiming.loadEventEnd);
      validateMetric("Page load", navTiming.loadEventEnd < 2000);

      // Page unload to record INP and CLS
      console.log("Page unload");
      await page.close();
      expect(badMetrics).toHaveLength(0);
   });
});