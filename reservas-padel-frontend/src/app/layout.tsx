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
      <body className="min-h-screen" style={{ 
        background: 'linear-gradient(135deg, var(--beige-50) 0%, var(--cream) 100%)',
        color: 'var(--dark-brown)'
      }}>
        <ConnectionProvider endpoint="https://api.devnet.solana.com">
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              {children}
              <ToastContainer 
                position="bottom-right" 
                theme="light"
                toastStyle={{
                  background: 'var(--warm-white)',
                  color: 'var(--dark-brown)',
                  border: '1px solid var(--beige-200)'
                }}
              />
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </body>
    </html>
  );
}
