# VERTEX Control Room - Deployment Guide

## 🚀 Quick Start Deployment

### **Prerequisites**
- Node.js 18+ installed
- npm or yarn package manager
- Access to `https://nexusdigital.orquestracrm.com.br/vertex/`

### **1. Build the Application**
```bash
cd control-room/frontend
npm install
npm run build
```

The build output will be in `control-room/frontend/dist/`

### **2. Deploy to Production**

#### **Option A: Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd control-room/frontend
vercel --prod
```

#### **Option B: Netlify**
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
cd control-room/frontend
netlify deploy --prod
```

#### **Option C: Traditional Hosting**
1. Upload `dist/` contents to your web server
2. Configure SSL/TLS certificates
3. Set up proper MIME types
4. Configure caching headers

### **3. Configure Environment**

#### **Production Environment Variables**
Create `.env.production` in `control-room/frontend/`:
```env
VITE_APP_TITLE=VERTEX Control Room
VITE_APP_VERSION=1.0.0
VITE_API_URL=https://api.nexusdigital.orquestracrm.com.br
VITE_WS_URL=wss://ws.nexusdigital.orquestracrm.com.br
```

#### **Build Configuration**
Update `vite.config.ts` if needed:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/vertex/', // If deploying to subdirectory
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three', '@react-three/fiber', '@react-three/drei'],
          charts: ['recharts'],
          utils: ['date-fns', 'zustand'],
        }
      }
    }
  }
})
```

## 🔧 Advanced Configuration

### **WebSocket Server Setup**
For real-time updates, deploy a WebSocket server:

```javascript
// backend/websocket-server.js
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  // Send system metrics every 5 seconds
  const interval = setInterval(() => {
    const metrics = {
      type: 'metrics',
      data: {
        cpu: Math.random() * 100,
        memory: Math.random() * 100,
        agents: [
          { id: '1', status: 'active', cpu: 45, memory: 68 },
          // ... more agents
        ]
      }
    };
    ws.send(JSON.stringify(metrics));
  }, 5000);

  ws.on('close', () => clearInterval(interval));
});
```

### **NGINX Configuration**
```nginx
server {
    listen 443 ssl http2;
    server_name nexusdigital.orquestracrm.com.br;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    root /var/www/vertex;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # HTML files
    location / {
        try_files $uri $uri/ /index.html;
        expires -1;
        add_header Cache-Control "no-store, no-cache, must-revalidate";
    }
    
    # WebSocket proxy
    location /ws {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
```

### **Docker Deployment**
```dockerfile
# Dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  vertex-frontend:
    build: ./control-room/frontend
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
  
  vertex-backend:
    build: ./control-room/backend
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/vertex
    depends_on:
      - db
  
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=vertex
      - POSTGRES_USER=vertex
      - POSTGRES_PASSWORD=securepassword
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## 📊 Monitoring & Analytics

### **Performance Monitoring**
```javascript
// Add to main.tsx
import { webVitals } from './utils/webVitals';

webVitals(console.log);

// Error tracking
window.addEventListener('error', (event) => {
  fetch('/api/errors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: event.message,
      source: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    })
  });
});
```

### **Google Analytics Integration**
```html
<!-- Add to index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## 🔒 Security Considerations

### **Content Security Policy**
Add to NGINX config or meta tags:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data: https:; 
               font-src 'self'; 
               connect-src 'self' wss://nexusdigital.orquestracrm.com.br;">
```

### **API Security**
- Implement rate limiting
- Use JWT for authentication
- Validate all input data
- Sanitize user inputs
- Use HTTPS only

## 🔄 Continuous Deployment

### **GitHub Actions Workflow**
```yaml
# .github/workflows/deploy.yml
name: Deploy VERTEX Control Room

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: |
          cd control-room/frontend
          npm ci
          
      - name: Build
        run: |
          cd control-room/frontend
          npm run build
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./control-room/frontend
```

## 🐛 Troubleshooting

### **Common Issues**

#### **1. 3D Rendering Performance**
```javascript
// Optimize Three.js rendering
import { Canvas } from '@react-three/fiber';

<Canvas
  dpr={[1, 2]} // Device pixel ratio
  gl={{ antialias: true, alpha: false }}
  camera={{ position: [0, 5, 10], fov: 60 }}
  performance={{ min: 0.5 }} // Lower framerate when needed
>
```

#### **2. Voice Recognition Not Working**
- Ensure HTTPS is used (required for Web Speech API)
- Check browser permissions
- Provide fallback UI for unsupported browsers

#### **3. Build Errors**
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npm run build
```

#### **4. CORS Issues**
Configure backend CORS:
```javascript
app.use(cors({
  origin: 'https://nexusdigital.orquestracrm.com.br',
  credentials: true
}));
```

## 📈 Performance Optimization

### **Bundle Analysis**
```bash
# Analyze bundle size
cd control-room/frontend
npm run build -- --report
```

### **Lighthouse Optimization**
1. Enable compression (gzip/brotli)
2. Optimize images (WebP format)
3. Implement lazy loading
4. Use service workers for caching
5. Minimize main thread work

### **CDN Configuration**
- Use CDN for static assets
- Implement cache invalidation strategy
- Configure proper cache headers
- Use HTTP/2 or HTTP/3

## 🔍 Testing Before Deployment

### **Checklist**
- [ ] All components render correctly
- [ ] Voice recognition works
- [ ] 3D animations are smooth
- [ ] Responsive design works on all devices
- [ ] All links and buttons work
- [ ] Error boundaries catch errors
- [ ] Performance meets targets
- [ ] Security headers are set
- [ ] SSL certificate is valid
- [ ] Backups are configured

### **Performance Targets**
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- First Input Delay: < 100ms
- Cumulative Layout Shift: < 0.1
- Time to Interactive: < 3.5s

## 🎯 Final Deployment Steps

1. **Pre-deployment**
   ```bash
   # Run tests
   npm test
   
   # Build for production
   npm run build
   
   # Run lighthouse audit
   npm run lighthouse
   ```

2. **Deployment**
   ```bash
   # Deploy to production
   npm run deploy
   ```

3. **Post-deployment**
   - Verify SSL certificate
   - Test all features
   - Monitor error logs
   - Check performance metrics
   - Set up alerts

4. **Monitoring**
   - Set up uptime monitoring
   - Configure error tracking
   - Set up performance monitoring
   - Configure backup alerts

## 📞 Support

For deployment assistance:
- **Documentation**: Check `IMPLEMENTATION_SUMMARY.md`
- **Issues**: GitHub repository issues
- **Contact**: nexusdigital@orquestracrm.com.br

The VERTEX Control Room is now ready for production deployment at `https://nexusdigital.orquestracrm.com.br/vertex/`!