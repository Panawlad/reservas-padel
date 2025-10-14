"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { toast } from "react-toastify";
import { preparePayment, confirmPayment } from "../lib/api";

interface PayUSDCButtonProps {
  reservationId: string;
  token: string;
}

export default function PayUSDCButton({ reservationId, token }: PayUSDCButtonProps) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [loading, setLoading] = useState<boolean>(false);

  const handlePay = async (): Promise<void> => {
    if (!publicKey) {
      toast.error("Conecta tu wallet Phantom antes de pagar.");
      return;
    }

    try {
      setLoading(true);
      toast.info("Preparando pago...");

      const data = await preparePayment(reservationId, token);
      const { receiver, usdcAmount } = data.payment;

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(receiver),
          lamports: usdcAmount * LAMPORTS_PER_SOL,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      toast.success("Transacción enviada 🚀");

      await confirmPayment(reservationId, signature, token);
      toast.success("✅ Pago confirmado correctamente");
    } catch (error) {
      console.error(error);
      toast.error("Error durante el proceso de pago");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePay}
      disabled={loading}
      className="px-5 py-3 rounded-lg bg-green-600 hover:bg-green-700 transition font-semibold text-white"
    >
      {loading ? "Procesando..." : "Pagar con USDC (Solana)"}
    </button>
  );
}
