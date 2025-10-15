"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";

export default function ClientWalletButton() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="wallet-adapter-wrapper">
        <div className="px-6 py-2.5 bg-white/20 backdrop-blur-sm text-white border border-white/30 text-sm font-semibold rounded-lg">
          Conectar Wallet
        </div>
      </div>
    );
  }

  return (
    <div className="wallet-adapter-wrapper">
      <WalletMultiButton />
    </div>
  );
}
