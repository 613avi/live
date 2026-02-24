const puppeteer = require('puppeteer');
const fs = require('fs');

const TARGET_URL = 'https://live.chatr.vip/7017383';

async function scrape() {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    // Collect all CSS from network requests
    const collectedCSS = [];
    
    page.on('response', async (response) => {
        const url = response.url();
        const contentType = response.headers()['content-type'] || '';
        
        if (contentType.includes('text/css') || url.endsWith('.css')) {
            try {
                const css = await response.text();
                collectedCSS.push({ url, css });
            } catch (e) {}
        }
    });

    console.log('Loading page...');
    await page.goto(TARGET_URL, { 
        waitUntil: 'networkidle0',
        timeout: 60000 
    });

    // Wait for dynamic content
    await new Promise(resolve => setTimeout(resolve, 8000));

    console.log('Extracting styles and content...');

    // Extract all inline styles and computed critical CSS
    const result = await page.evaluate(() => {
        // Get all style tags content
        const styleContents = [];
        document.querySelectorAll('style').forEach(style => {
            styleContents.push(style.textContent);
        });

        // Get body HTML
        const bodyHTML = document.body.innerHTML;
        
        // Get computed styles for key elements
        const computedStyles = [];
        const elements = document.querySelectorAll('*');
        elements.forEach(el => {
            if (el.id || el.className) {
                const styles = window.getComputedStyle(el);
                const important = ['background', 'background-color', 'color', 'font-family', 'font-size', 
                    'font-weight', 'display', 'flex-direction', 'justify-content', 'align-items',
                    'width', 'height', 'padding', 'margin', 'border', 'border-radius', 'box-shadow',
                    'position', 'top', 'left', 'right', 'bottom', 'transform', 'opacity', 'z-index'];
                
                const styleStr = important.map(prop => {
                    const val = styles.getPropertyValue(prop);
                    return val ? `${prop}: ${val}` : '';
                }).filter(Boolean).join('; ');
                
                if (el.id) {
                    computedStyles.push(`#${el.id} { ${styleStr} }`);
                }
            }
        });

        return { styleContents, bodyHTML, computedStyles };
    });

    // Build combined CSS
    let combinedCSS = '';
    
    // Add collected CSS from network
    for (const { url, css } of collectedCSS) {
        // Fix relative URLs in CSS
        const fixedCSS = css.replace(/url\(['"]?(?!data:)(?!http)([^'")]+)['"]?\)/g, (match, path) => {
            try {
                const baseUrl = new URL(url);
                const absoluteUrl = new URL(path, baseUrl).href;
                return `url('${absoluteUrl}')`;
            } catch (e) {
                return match;
            }
        });
        combinedCSS += `/* Source: ${url} */\n${fixedCSS}\n\n`;
    }

    // Add inline styles
    for (const style of result.styleContents) {
        combinedCSS += style + '\n';
    }

    // Create final HTML
    const finalHTML = `<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>מגבית פורים - סטטיסטיקות</title>
    <base href="https://live.chatr.vip/">
    <style>
/* === ALL COLLECTED CSS === */
${combinedCSS}

/* === CRITICAL OVERRIDES === */
body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
}
    </style>
</head>
<body>
${result.bodyHTML}
</body>
</html>`;

    await browser.close();

    fs.writeFileSync('content.html', finalHTML);
    console.log('✅ Scraped successfully at', new Date().toISOString());
    console.log(`📊 Collected ${collectedCSS.length} CSS files`);
}

scrape().catch(err => {
    console.error('❌ Scrape failed:', err);
    process.exit(1);
});
