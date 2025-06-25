# CivicAI: Smart Proposal Engine for Island Governance

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/daghondi/CivicAI-Crypto_Cities_Hackathon)

## 🚀 Overview

CivicAI transforms civic engagement by using AI to convert citizen-reported problems into structured, actionable governance proposals. Built for island communities like Próspera/Roatán, it bridges the gap between community needs and effective local governance.

## ✨ Features

- 🤖 **AI-Powered Proposals:** Convert problems into structured civic solutions
- 🗳️ **Blockchain Voting:** Transparent, wallet-based voting system
- 💰 **I₵C Integration:** Infinita City Credits reward system
- 📱 **Mobile-First:** Responsive design for all devices
- 🌐 **Web3 Ready:** WalletConnect integration for identity

## 🛠 Tech Stack

- **Frontend:** Next.js 14, React, Tailwind CSS
- **Backend:** Supabase (PostgreSQL)
- **AI:** OpenAI GPT-4o / Claude
- **Blockchain:** WalletConnect, Thirdweb (optional)
- **Deployment:** Vercel

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- OpenAI API key

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

## 🧑‍💻 Usage

- **Submit civic issues:** Users report problems or suggestions via the app.
- **AI proposal generation:** The system turns reports into structured proposals.
- **Voting:** Community members can vote using blockchain wallets.
- **Rewards:** Participants can earn ICC tokens for engagement.

*(Screenshots or demo video to be added here for a visual walkthrough.)*

## ⚙️ Configuration

- Set all required environment variables in the `.env` file.
- Refer to the `.env.example` file for the required keys.
- Ensure your Supabase instance is set up with the appropriate schema (see `/supabase` or `/docs` if present).

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
