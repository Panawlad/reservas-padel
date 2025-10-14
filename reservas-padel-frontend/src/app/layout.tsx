"use client";

import { ReactNode } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import "./globals.css";

const wallets = [new PhantomWalletAdapter()];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-black text-white">
        <ConnectionProvider endpoint="https://api.devnet.solana.com">
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              {children}
              <ToastContainer position="bottom-right" theme="dark" />
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </body>
    </html>
  );
}
