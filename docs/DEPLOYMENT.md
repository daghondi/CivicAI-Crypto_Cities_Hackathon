# 🚀 CivicAI Deployment Guide

## Overview
This guide covers deployment of the CivicAI platform across different environments and platforms.

## 🌐 Platform Options

### 1. Vercel (Recommended)
- **Best for**: Production deployment with automatic CI/CD
- **Cost**: Free tier available
- **Features**: Edge functions, automatic HTTPS, global CDN

### 2. Netlify
- **Best for**: Static site hosting with serverless functions
- **Cost**: Free tier available
- **Features**: Form handling, split testing

### 3. Railway
- **Best for**: Full-stack deployment with database
- **Cost**: $5/month minimum
- **Features**: PostgreSQL included, automatic scaling

## 🔧 Environment Setup

### Prerequisites
- Node.js 18+
- Git repository
- Supabase account
- OpenAI API key
- WalletConnect Project ID

### Environment Variables
Copy `.env.local.example` to `.env.local` and configure:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AI Configuration
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key

# Web3 Configuration
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=CivicAI
NEXT_PUBLIC_NETWORK_NAME=Próspera
```

## 🚀 Deployment Steps

### Option 1: Vercel Deployment

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login and deploy
   vercel login
   vercel
   ```

2. **Configure Environment Variables**
   - Go to Vercel Dashboard
   - Select your project
   - Add environment variables from `.env.local`

3. **Set Build Commands**
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": ".next",
     "installCommand": "npm install"
   }
   ```

### Option 2: Railway Deployment

1. **Connect Repository**
   - Visit railway.app
   - Connect GitHub repository
   - Select deployment branch

2. **Configure Database**
   ```bash
   # Railway will automatically provision PostgreSQL
   # Use connection string in Supabase setup
   ```

3. **Set Environment Variables**
   - Add all variables from `.env.local`
   - Configure custom domain if needed

### Option 3: Docker Deployment

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine
   
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   
   COPY . .
   RUN npm run build
   
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Build and Deploy**
   ```bash
   docker build -t civicai .
   docker run -p 3000:3000 civicai
   ```

## 🗄️ Database Setup

### Supabase Configuration

1. **Create Project**
   - Go to supabase.com
   - Create new project
   - Note the project URL and API keys

2. **Run Migrations**
   ```bash
   npm run setup-db
   ```

3. **Seed Data**
   ```bash
   npm run seed
   ```

## 🔐 Security Configuration

### API Security
- Enable Row Level Security (RLS) in Supabase
- Configure CORS policies
- Set up rate limiting

### Environment Security
- Never commit `.env.local` to version control
- Use different API keys for different environments
- Enable 2FA on all service accounts

## 📊 Monitoring & Analytics

### Performance Monitoring
- Vercel Analytics (built-in)
- Google Analytics 4
- Sentry for error tracking

### Database Monitoring
- Supabase built-in analytics
- Custom metrics dashboard

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run build
      - run: npm run test
```

## 🌍 Domain Configuration

### Custom Domain Setup
1. **Purchase Domain**
   - Recommended: Namecheap, Cloudflare
   - Consider: civicai.gov (if eligible)

2. **Configure DNS**
   ```
   Type: CNAME
   Name: @
   Value: your-vercel-deployment.vercel.app
   ```

3. **SSL Certificate**
   - Automatic with Vercel/Netlify
   - Let's Encrypt for custom setups

## 📱 Mobile Deployment

### Progressive Web App (PWA)
- Service worker configuration
- App manifest setup
- iOS/Android app store submission (optional)

## 🧪 Testing in Production

### Health Checks
- API endpoint monitoring
- Database connection tests
- External service availability

### Load Testing
```bash
# Using Apache Bench
ab -n 1000 -c 10 https://your-domain.com/

# Using Artillery
artillery quick --count 100 --num 10 https://your-domain.com/
```

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Review TypeScript errors

2. **Environment Variable Issues**
   - Ensure all required variables are set
   - Check for typos in variable names
   - Verify API key permissions

3. **Database Connection**
   - Check Supabase project status
   - Verify connection string format
   - Test network connectivity

### Support Resources
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)

## 📈 Scaling Considerations

### Performance Optimization
- Enable CDN for static assets
- Implement caching strategies
- Optimize database queries

### Cost Optimization
- Monitor usage metrics
- Implement request throttling
- Use serverless functions efficiently

---

## 🎯 Go Live Checklist

- [ ] Environment variables configured
- [ ] Database migrations completed
- [ ] SSL certificate active
- [ ] Custom domain configured
- [ ] Monitoring setup complete
- [ ] Backup strategy implemented
- [ ] Security audit completed
- [ ] Performance testing passed
- [ ] Documentation updated
- [ ] Team access configured

---

**Ready to change the world with AI-powered civic engagement!** 🌟

For support: [Create an issue](https://github.com/yourusername/CivicAI-Crypto_Cities_Hackathon/issues)
