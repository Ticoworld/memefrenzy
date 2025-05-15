import { useEffect, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

// Import individual wallet adapters
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";
import { BackpackWalletAdapter } from "@solana/wallet-adapter-backpack";
import { TorusWalletAdapter } from "@solana/wallet-adapter-torus";

import { Buffer } from 'buffer'
globalThis.Buffer = Buffer

// Import react-hot-toast
import { Toaster } from "react-hot-toast";

import { CONFIG } from "./config";

// Import wallet adapter styles
import "@solana/wallet-adapter-react-ui/styles.css";

// Animation on scroll
import AOS from "aos";
import "aos/dist/aos.css";

// Page Components
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Tokenomics from "./components/Tokenomics";
import About from "./components/About";
import Roadmap from "./components/Roadmap";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import PartnersSection from "./components/PartnersSection";
import StakingSection from "./components/StakingSection";

// Page Route Components
import Airdrop from "./pages/Airdrop";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AirdropsList from "./pages/Admin/AirdropsList";
import PendingApprovals from "./pages/Admin/PendingApprovals";
import AdminUsers from "./pages/Admin/AdminUsers";
import AirdropClaimDetails from "./pages/Admin/AirdropClaimDetails";
import DistributedAirdrops from "./pages/Admin/DistributedAirdrops";
import AirdropSection from "./components/AirdropSection";

// Use the RPC endpoint from your CONFIG
const rpcEndpoint = CONFIG.QUICKNODE_API_KEY; // Ensure this is your full QuickNode URL

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new BackpackWalletAdapter(),
      new TorusWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={rpcEndpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Router>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Navbar />
                    <Hero />
                    <AirdropSection />
                    <About />
                    <StakingSection />
                    <Tokenomics />
                    <Roadmap />
                    <FAQ />
                    <PartnersSection />
                    <Footer />
                  </>
                }
              />
              <Route path="/airdrop" element={<Airdrop />} />
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/airdrops" element={<AirdropsList />} />
              <Route path="/admin/approvals" element={<PendingApprovals />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/distributed-airdrops" element={<DistributedAirdrops />} />
              <Route
                path="/admin/airdrops/claim/:claimId"
                element={<AirdropClaimDetails />}
              />{" "}
              {/* <<< NEW ROUTE */}
              {/* Fallback 404 Page */}
              <Route
                path="*"
                element={
                  <div className="flex items-center justify-center min-h-screen text-white text-2xl p-4">
                    404 - Page Not Found
                  </div>
                }
              />
            </Routes>
          </Router>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#1F2937", // Match your dark theme (gray-800)
                color: "#FFFFFF", // White text
                border: "1px solid #4B5563", // Gray-600 border
              },
              success: {
                style: {
                  border: "1px solid #10B981", // Green-500 for success
                },
              },
              error: {
                style: {
                  border: "1px solid #EF4444", // Red-500 for error
                },
              },
            }}
          />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
