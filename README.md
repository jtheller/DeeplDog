# DeeplDog
Scrape that translation

Download zip or clone the project, go `npm i` and `node app` to try it out. You need NodeJS and NPM.

Read `app.js` for scrape logic, it's simple and works well, but not sure if you would get hit by captcha at some point. Technically by setting Chromium userDataDir (default being __dirname + "/chromium") should help mitigate this problem, we will see. 
