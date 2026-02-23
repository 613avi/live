const puppeteer = require('puppeteer');
const fs = require('fs');

const TARGET_URL = 'https://live.chatr.vip/7017383';
const WAIT_MS = 5000; // המתן 5 שניות לטעינת ה-JS

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  });

  try {
    const page = await browser.newPage();

    // דמה דפדפן רגיל
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    await page.setViewport({ width: 1280, height: 800 });

    // טען את הדף וחכה לרשת שקטה + זמן נוסף לאנימציות
    await page.goto(TARGET_URL, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    await new Promise(r => setTimeout(r, WAIT_MS));

    // קבל את ה-HTML המרונדר המלא
    let html = await page.content();

    // הסר תגיות base ישנות אם יש
    html = html.replace(/<base[^>]*>/gi, '');

    // הוסף base tag שיצביע על האתר המקורי (כדי שכל ה-assets ייטענו)
    html = html.replace(
      '<head>',
      `<head>\n  <base href="${new URL(TARGET_URL).origin}/">`
    );

    // הסר את ה-script של הרענון הישן אם כבר קיים (לא לכפול)
    html = html.replace(/<!-- MIRROR-REFRESH[\s\S]*?MIRROR-REFRESH -->/g, '');

    // כתוב לקובץ
    fs.writeFileSync('content.html', html, 'utf8');

    // עדכן קובץ גרסה עם timestamp
    fs.writeFileSync('version.txt', Date.now().toString(), 'utf8');

    console.log('✅ Scraped successfully at', new Date().toISOString());

  } catch (err) {
    console.error('❌ Scrape failed:', err.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
