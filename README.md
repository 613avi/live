# 📊 Campaign Mirror

שיקוף אוטומטי של מצגת הקמפיין — מתעדכן כל 5 דקות, ללא רפרוף.

---

## 🚀 הגדרה — 4 שלבים בלבד

### שלב 1 — צור ריפו חדש בגיטהאב
- היכנס ל-GitHub ולחץ **New repository**
- תן לו שם (לדוגמה `campaign-mirror`)
- השאר **Public**
- **אל תסמן** "Add README" (הריפו חייב להיות ריק)

### שלב 2 — העלה את הקבצים
גרור את כל תכולת התיקייה הזו לריפו החדש, או השתמש ב-Git:

```bash
cd campaign-mirror
git init
git remote add origin https://github.com/YOUR_USERNAME/campaign-mirror.git
git add .
git commit -m "initial setup"
git push -u origin main
```

### שלב 3 — הפעל GitHub Pages
- לך ל **Settings → Pages**
- תחת **Source** בחר: **Deploy from a branch**
- Branch: `main` / folder: `/ (root)`
- לחץ **Save**

### שלב 4 — אפשר ל-Actions לכתוב לריפו
- לך ל **Settings → Actions → General**
- גלול ל **Workflow permissions**
- בחר **Read and write permissions**
- לחץ **Save**

---

## ✅ זהו!

לאחר כ-5-10 דקות האתר שלך יהיה חי בכתובת:
`https://YOUR_USERNAME.github.io/campaign-mirror`

---

## 🔄 איך זה עובד

| רכיב | תפקיד |
|------|--------|
| `scrape.js` | Puppeteer טוען את האתר המקורי עם Chrome headless ושומר HTML מלא |
| `.github/workflows/update.yml` | מריץ את ה-scraper כל 5 דקות אוטומטית |
| `index.html` | מציג את התוכן ובודק עדכונים כל דקה ברקע |
| `content.html` | ה-HTML המרונדר שמתעדכן |
| `version.txt` | timestamp — משמש לזיהוי שינויים |

### ללא רפרוף — Double Buffer Technique
הדפדפן טוען את ה-content חדש בסתר ב-iframe נסתר. רק כשהטעינה הושלמה לחלוטין — מתבצע החלפה חלקה (fade). המשתמש לא רואה שום תקתוק.

---

## ⚙️ התאמות אפשריות

שנה ב-`index.html`:
```js
var CHECK_INTERVAL = 60 * 1000; // בדיקת עדכון כל דקה (בms)
```

שנה ב-`.github/workflows/update.yml`:
```yaml
- cron: '*/5 * * * *'  # שנה 5 ל-10 לרענון כל 10 דקות
```
