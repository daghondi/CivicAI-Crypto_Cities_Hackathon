# CivicAI: Advanced Web3 Governance Platform for Crypto Cities

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/daghondi/CivicAI-Crypto_Cities_Hackathon)

## 🚀 Overview

CivicAI revolutionizes civic engagement by combining AI-powered proposal generation with Web3 governance infrastructure. Built for crypto cities and island communities like Próspera/Roatán, it enables citizens to transform problems into actionable proposals through cryptographically-verified voting systems.

## ✨ Key Features

### 🤖 **AI-Powered Civic Intelligence**
- **Smart Proposal Generation**: Convert citizen problems into structured governance proposals
- **Impact Assessment**: AI-driven feasibility scoring and risk analysis
- **Cost Estimation**: Automated budget calculations with ICC incentive structures
- **Multi-Language Support**: Natural language processing for diverse communities

### 🗳️ **Advanced Web3 Governance**
- **Cryptographic Voting**: Wallet signature-based voting with one-vote-per-user enforcement
- **Real-Time Verification**: Server-side signature validation and tamper-proof vote recording
- **Optimism Sepolia Integration**: Built for Layer 2 scalability and cost efficiency
- **Governance Analytics**: Comprehensive voting statistics and participation tracking

### 👤 **Decentralized Identity & Reputation**
- **Wallet-Based Profiles**: ENS resolution with personalized user badges
- **Reputation System**: Dynamic scoring based on civic engagement and voting history
- **Achievement Badges**: Gamified participation rewards (First Vote, Active Participant, etc.)
- **Transparent History**: Public voting records with privacy-preserving design

### �️ **Democratic Infrastructure**
- **Proposal Lifecycle**: Complete workflow from creation to implementation
- **Quorum Management**: Configurable voting thresholds and participation requirements
- **Time-Bound Governance**: Automatic voting periods with deadline enforcement
- **Multi-Category Support**: Infrastructure, environment, economy, healthcare, and more

## 🛠 Tech Stack

### **Frontend & UI**
- **Next.js 14**: App Router with React Server Components
- **TypeScript**: Full type safety and enhanced developer experience
- **Tailwind CSS**: Utility-first styling with custom design system
- **Lucide Icons**: Modern icon library with consistent styling

### **Backend & Database**
- **Supabase**: PostgreSQL with real-time subscriptions
- **REST APIs**: Next.js API routes with middleware protection
- **Database Migrations**: Version-controlled schema management
- **Row Level Security**: Fine-grained data access control

### **AI & Machine Learning**
- **OpenAI GPT-4**: Advanced proposal generation and analysis
- **Anthropic Claude**: Alternative AI provider for redundancy
- **Structured Prompts**: Optimized templates for civic use cases
- **Cost Optimization**: Efficient token usage and caching

### **Web3 & Blockchain**
- **Thirdweb SDK**: Simplified Web3 integration and wallet management
- **Ethers.js**: Ethereum library for signature verification
- **Optimism Sepolia**: Layer 2 testnet for scalable governance
- **ENS Integration**: Decentralized name resolution for user identity

### **Security & Performance**
- **Cryptographic Signatures**: Message signing for vote authentication
- **Rate Limiting**: API protection against abuse
- **Server-Side Validation**: Secure signature verification
- **CORS Protection**: Cross-origin request security

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** with npm or yarn
- **Supabase account** for database and authentication
- **OpenAI API key** for AI proposal generation
- **Thirdweb account** for Web3 SDK integration
- **WalletConnect Project ID** for wallet connections

### Installation

1. **Clone the repository**
    ```bash
    git clone https://github.com/daghondi/CivicAI-Crypto_Cities_Hackathon.git
    cd CivicAI-Crypto_Cities_Hackathon
    ```

2. **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3. **Configure environment variables**
    Copy `.env.local.example` to `.env.local` and configure all required variables:

    ```bash
    cp .env.local.example .env.local
    ```

    **Required Environment Variables:**
    ```bash
    # Supabase Configuration
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

    # AI Configuration
    OPENAI_API_KEY=sk-your-openai-api-key
    ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key

    # Web3 Configuration
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
    NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id

    # Feature Flags
    NEXT_PUBLIC_ENABLE_AI=true
    NEXT_PUBLIC_ENABLE_ENS=true
    NEXT_PUBLIC_ENABLE_BADGES=true
    NEXT_PUBLIC_ENABLE_REPUTATION=true
    ```

4. **Set up database**
    ```bash
    # Run database migrations
    npm run db:migrate
    
    # Seed with sample data (optional)
    npm run db:seed
    ```

5. **Run the development server**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

6. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

    Copy `.env.example` to `.env` and fill in your configuration details:

    ```bash
    cp .env.example .env
    ```

    In your `.env` file, set up:
    - Your Supabase project URL and anon/public keys
    - Your OpenAI API key

4. **Run the app locally**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## 🧑‍💻 Usage Guide

### **For Citizens:**
1. **Connect Your Wallet**: Use MetaMask, WalletConnect, or Coinbase Wallet
2. **Submit Civic Issues**: Report problems using the guided form interface
3. **AI-Generated Proposals**: Review AI-created structured solutions
4. **Participate in Voting**: Cast cryptographically-signed votes on proposals
5. **Track Your Impact**: View your voting history and reputation score

### **For Governance:**
1. **Monitor Proposals**: Review community-submitted governance proposals
2. **Analyze Participation**: Track voting patterns and community engagement
3. **Implement Solutions**: Use vote results to guide policy decisions
4. **Manage Reputation**: Award badges and recognition for active participants

### **Key User Flows:**

#### **Proposal Creation Workflow**
```
Problem Report → AI Analysis → Proposal Generation → Community Review → Voting
```

#### **Voting Process**
```
Connect Wallet → Review Proposal → Cast Vote → Sign Transaction → Vote Recorded
```

#### **Reputation Building**
```
First Vote Badge → Active Participant → Proposal Creator → Community Leader
```

### **Demo Features:**
- **Real-time voting results** with live updates
- **Comprehensive user profiles** with ENS integration
- **Proposal analytics** and participation metrics
- **Mobile-responsive design** for accessibility
- **Offline proposal viewing** for better UX

## ⚙️ Configuration & Customization

### **Environment Configuration**
- All configuration is managed through environment variables
- Feature flags allow enabling/disabling specific functionality
- Database settings configured through Supabase dashboard
- AI providers can be switched between OpenAI and Anthropic

### **Blockchain Configuration**
- Default network: Optimism Sepolia (testnet)
- Configurable for other EVM-compatible networks
- Contract addresses set via environment variables
- Gas optimization for Layer 2 scaling

### **AI Configuration**
- Customizable prompt templates for proposal generation
- Adjustable AI model parameters for different use cases
- Multi-provider failover for reliability
- Cost monitoring and usage analytics

### **Governance Parameters**
- Configurable voting periods and quorum requirements
- Adjustable reputation scoring algorithms
- Customizable badge criteria and rewards
- Flexible proposal categories and workflows

## 🏗️ Architecture Overview

### **Frontend Architecture**
- **App Router**: Next.js 14 with React Server Components
- **Component Library**: Reusable UI components with TypeScript
- **State Management**: React Context for Web3 and user state
- **Responsive Design**: Mobile-first with Tailwind CSS

### **Backend Architecture**
- **API Layer**: Next.js API routes with middleware protection
- **Database**: Supabase PostgreSQL with Row Level Security
- **Authentication**: Wallet-based auth with signature verification
- **Real-time**: Supabase subscriptions for live updates

### **Security Architecture**
- **Client-Side**: Wallet signature generation and verification
- **Server-Side**: Cryptographic signature validation
- **Database**: RLS policies for data access control
- **API**: Rate limiting and CORS protection

## 📊 Performance & Scalability

- **Database Optimization**: Indexed queries and efficient schemas
- **API Caching**: Response caching for improved performance
- **Image Optimization**: Next.js automatic image optimization
- **Bundle Optimization**: Code splitting and lazy loading
- **CDN Integration**: Vercel Edge Network for global distribution

## 🤝 Contributing

Contributions are welcome! To get started:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Create a Pull Request

Please check for existing issues before starting new work. For major changes, open an issue to discuss what you would like to change.

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## 🙌 Acknowledgements
- Hosted by [Infinita City](https://www.infinita.city/) , [Odeiea](https://www.odisea.xyz/) , and [TAIKAI](https://taikai.network/)
- Inspired by the needs of island governance and digital democracy.
- Powered by  [Próspera](https://www.prospera.co/), [Supabase](https://supabase.com/), [OpenAI](https://openai.com/), and the Web3 ecosystem.

## 📫 Contact

For questions, feedback, or support, please open an issue or contact [@daghondi](https://github.com/daghondi).

---
