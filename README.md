# Campaign Stats Mirror

מראה של סטטיסטיקות קמפיין ב-GitHub Pages עם עדכון אוטומטי כל 5 דקות.

## התקנה

1. **צור ריפו חדש** ב-GitHub (יכול להיות public או private עם GitHub Pro)

2. **העלה את כל הקבצים** לריפו

3. **הפעל GitHub Pages:**
   - Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main` / `(root)`
   - Save

4. **תן הרשאות כתיבה ל-Actions:**
   - Settings → Actions → General
   - Workflow permissions: **Read and write permissions**
   - Save

5. **הרץ את ה-Action ידנית בפעם הראשונה:**
   - Actions → Update Campaign Mirror → Run workflow

## איך זה עובד

- **GitHub Action** רץ כל 5 דקות ומוריד את הדף המקורי עם Puppeteer (Chrome headless)
- **כל ה-CSS** נאסף ומוטמע בתוך ה-HTML כדי לשמור על העיצוב
- **הדפדפן** בודק עדכונים כל דקה ומחליף את התוכן בצורה חלקה (double-buffer)

## קבצים

- `scrape.js` - סקריפט שמוריד את הדף ושומר אותו
- `index.html` - הדף הראשי שמציג את התוכן עם רענון חלק
- `content.html` - התוכן שנשמר (מתעדכן אוטומטית)
- `.github/workflows/update.yml` - הגדרות GitHub Action

## פתרון בעיות

### התוכן לא מתעדכן
בדוק ב-Actions → הריצה האחרונה → ראה אם יש שגיאה

### העיצוב שבור
ייתכן שהאתר המקורי משתמש ב-fonts או נכסים שלא ניתן להוריד. פתח issue ואעזור לתקן.

### ה-Action לא רץ
וודא שנתת הרשאות כתיבה (ראה שלב 4 בהתקנה)
