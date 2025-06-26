# 🚀 CivicAI Production Deployment Guide v2.0

## Overview
This comprehensive guide covers production deployment of the CivicAI Web3 governance platform across multiple environments with enterprise-grade security, scalability, and reliability.

## 🌐 Recommended Platform Options

### 1. **Vercel (Primary Recommendation)**
- **Best for**: Production deployment with global edge network
- **Cost**: Free tier (hobby), Pro ($20/month), Enterprise (custom)
- **Features**: 
  - Edge Functions with 100ms cold start
  - Automatic HTTPS with custom domains
  - Global CDN with 70+ regions
  - Built-in analytics and monitoring
  - Optimized for Next.js applications

### 2. **Netlify (Alternative)**
- **Best for**: JAMstack deployment with integrated CI/CD
- **Cost**: Free tier available, Pro ($19/month)
- **Features**: 
  - Serverless functions with 1000 invocations/month (free)
  - Form handling and identity management
  - Split testing and feature flags
  - Integrated Git workflow

### 3. **Railway (Full-Stack Option)**
- **Best for**: Complete infrastructure with managed database
- **Cost**: $5/month minimum, usage-based pricing
- **Features**: 
  - Managed PostgreSQL included
  - Automatic scaling and monitoring
  - Docker container support
  - Integrated metrics and logging

### 4. **AWS/Google Cloud/Azure (Enterprise)**
- **Best for**: Large-scale enterprise deployments
- **Cost**: Variable based on usage
- **Features**: 
  - Full infrastructure control
  - Advanced security and compliance
  - Global load balancing
  - Kubernetes orchestration

## 🔧 Production Environment Setup

### Prerequisites
- **Node.js 18+** with npm/yarn package manager
- **Git repository** with proper branching strategy
- **Supabase Pro account** for production database
- **OpenAI API key** with sufficient credits
- **Thirdweb account** with production app configured
- **WalletConnect Project ID** for Web3 integration
- **Domain name** with SSL certificate
- **CDN setup** for global asset distribution

### Critical Environment Variables

**Copy `.env.local.example` to `.env.local` and configure all required variables:**

```bash
# Core Database Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your_anon_key
SUPABASE_SERVICE_ROLE_KEY=eyJ...your_service_role_key

# AI Provider Configuration
OPENAI_API_KEY=sk-...your_openai_key
ANTHROPIC_API_KEY=sk-ant-...your_anthropic_key

# Web3 Infrastructure
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_id
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id

# Application Configuration
NEXT_PUBLIC_APP_URL=https://your-production-domain.com
NEXT_PUBLIC_APP_NAME=CivicAI
NEXT_PUBLIC_NETWORK_NAME=Próspera
NEXT_PUBLIC_ENVIRONMENT=production

# Feature Flags (Production Optimized)
NEXT_PUBLIC_ENABLE_AI=true
NEXT_PUBLIC_ENABLE_ENS=true
NEXT_PUBLIC_ENABLE_BADGES=true
NEXT_PUBLIC_ENABLE_REPUTATION=true

# Blockchain Configuration (Optimism Sepolia Testnet)
NEXT_PUBLIC_ICC_TOKEN_ADDRESS=0x...deployed_contract_address
NEXT_PUBLIC_GOVERNANCE_ADDRESS=0x...governance_contract_address

# Security & Rate Limiting
RATE_LIMIT_VOTING_REQUESTS=10
RATE_LIMIT_VOTING_WINDOW=60
RATE_LIMIT_PROPOSAL_REQUESTS=3
RATE_LIMIT_PROPOSAL_WINDOW=3600

# Performance Monitoring
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
SENTRY_DSN=your_sentry_dsn
VERCEL_ANALYTICS_ID=your_vercel_analytics_id
```

## 🚦 Deployment Process

### **1. Pre-Deployment Checklist**

**Code Quality:**
- [ ] All TypeScript errors resolved
- [ ] ESLint warnings addressed
- [ ] Unit tests passing (>90% coverage)
- [ ] Integration tests validated
- [ ] Performance benchmarks met

**Security Audit:**
- [ ] Environment variables secured
- [ ] API endpoints protected
- [ ] Rate limiting configured
- [ ] CORS policies implemented
- [ ] Security headers configured

**Database Preparation:**
- [ ] Production database provisioned
- [ ] Migrations applied
- [ ] Indexes optimized
- [ ] Backup strategy implemented
- [ ] Row Level Security policies active

### **2. Vercel Deployment (Recommended)**

**Automatic Deployment:**
```bash
# Connect to Vercel
npx vercel login
npx vercel link

# Deploy to production
npx vercel --prod

# Set environment variables
npx vercel env add NEXT_PUBLIC_SUPABASE_URL
npx vercel env add SUPABASE_SERVICE_ROLE_KEY
npx vercel env add OPENAI_API_KEY
# ... (repeat for all environment variables)
```

**Manual Deployment via Dashboard:**
1. Connect GitHub repository to Vercel
2. Configure build settings:
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`
3. Add all environment variables in Vercel dashboard
4. Configure custom domain and SSL
5. Enable Vercel Analytics and monitoring

### **3. Database Migration & Setup**

```bash
# Run production migrations
npm run db:migrate:prod

# Seed initial data (if needed)
npm run db:seed:prod

# Verify database health
npm run db:health-check
```

### **4. Post-Deployment Verification**

**Functional Testing:**
```bash
# Run automated test suite
npm run test:e2e:prod

# Manual verification checklist:
# - Wallet connection works
# - AI proposal generation functional
# - Voting system operational
# - User profiles loading correctly
# - Real-time updates working
```

**Performance Testing:**
```bash
# Load testing with Artillery
npm run test:load

# Lighthouse audit
npm run audit:lighthouse

# Core Web Vitals check
npm run audit:cwv
```
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
