# Deploy to Vercel

## Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "map agent v1"
# create repo on github.com first, then:
git remote add origin https://github.com/YOUR_USERNAME/map-agent.git
git push -u origin main
```

## Step 2 — Deploy to Vercel
```bash
npm install -g vercel
vercel login
vercel --prod
```

## Step 3 — Add Environment Variables
```bash
vercel env add ANTHROPIC_API_KEY
vercel env add YOUTUBE_API_KEY
vercel env add CURSEFORGE_API_KEY
# paste each key when prompted
```

## Step 4 — vercel.json config
Create this file in project root:
```json
{
  "version": 2,
  "builds": [{ "src": "server.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "/server.js" }]
}
```

## Step 5 — Redeploy after env vars
```bash
vercel --prod
```

Your app will be live at: `https://map-agent-YOUR_USERNAME.vercel.app`

## Add Custom Domain (optional)
```bash
vercel domains add yourdomain.com
```
Then update DNS nameservers to Vercel's.

## Check Logs
```bash
vercel logs
```
