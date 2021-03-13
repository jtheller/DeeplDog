const readline = require('readline');
const puppeteer = require("puppeteer");
const path = require("path");
const userDataDir = path.join(__dirname, "/chromium");

const sourceLang = "jp";
const targetLang = "en";

const prompt = query => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans);
  }))
}

const translate = text => {
  console.log(`Source language ${sourceLang}`);
  console.log(`Target language ${targetLang}`);
  console.log("Input:", text);

  const url = `https://www.deepl.com/translator#${sourceLang}/${targetLang}/${encodeURIComponent(text)}`;
  let Browser;

  console.log("\nDeepL scrape start...")
  return puppeteer.launch({
    headless: true,
    userDataDir
  })
  .then(async browser => {
    Browser = browser;
    const page = await browser.newPage();

    return page.setViewport({ width: 1920, height: 1080 })
    .then(() => {
      console.log("Set UA");
      return page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3980.0 Safari/537.36 Edg/80.0.355.1")
    })
    .then(() => {
      console.log("Start navigation");
      return page.goto(url, { waitUntil: "load" })
    })
    .then(() => {
      console.log("Wait translation ajax");
      return page.waitForNavigation({ waitUntil: ["networkidle0", "load", "domcontentloaded"], timeout: 20 * 1000 })
    })
    .then(() => {
      console.log("Get result div");
      return page.$("#target-dummydiv")
    })
    .then(resultElm => {
      console.log("Parse result");
      return resultElm && page.evaluate(result => result.textContent, resultElm)
    })
    .then(result => {
      // Do logic
      // ...
      console.log("\nTranslated:");
      console.log(result && result.trim());
    });
  })
  .catch(err => {
    console.error(err);
    return Promise.reject(err);
  })
  .finally(() => Browser && Browser.close());
}

prompt("Input text to be translated from JP => EN: ")
.then(translate);