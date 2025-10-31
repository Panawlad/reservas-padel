"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import QRCode from "react-qr-code";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { toast } from "react-toastify";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

interface Reservation {
  id: string;
  status: string;
  totalCents: number;
  currency: string;
  timeslot: {
    startTime: string;
    endTime: string;
  };
  court: {
    name: string;
    club: { name: string };
  };
}

// ============================================================
// 🧩 Componente principal con toda la lógica del pago
// ============================================================
function PaymentPageContent() {
  const router = useRouter();
  const params = useSearchParams();
  const reservationId = params.get("reservationId");
  const paymentMethod = params.get("method");

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [qrData, setQrData] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";

  useEffect(() => {
    if (!token || !reservationId) {
      router.push("/auth");
      return;
    }
    loadReservation();
  }, [token, reservationId, router]);

  const loadReservation = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${API_URL}/reservations/${reservationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setReservation({
        id: data.id,
        status: data.status,
        totalCents: data.totalCents,
        currency: data.currency,
        timeslot: {
          startTime: data.timeslot?.startTime || "",
          endTime: data.timeslot?.endTime || "",
        },
        court: {
          name: data.court?.name || "",
          club: { name: data.court?.club?.name || "" },
        },
      });
      setLoading(false);
    } catch (error) {
      console.error("Error cargando reserva:", error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        // Si no se encuentra la reserva, redirigir
        router.push("/home");
      }
      setLoading(false);
    }
  };

  const handleMercadoPagoPayment = async () => {
    try {
      setLoading(true);
      toast.info("Redirigiendo a Mercado Pago...");

      // Simulación de pago con Mercado Pago
      const mockPaymentUrl =
        "https://www.mercadopago.com.mx/checkout/v1/redirect?pref_id=123456789";
      setPaymentUrl(mockPaymentUrl);

      setTimeout(() => {
        window.open(mockPaymentUrl, "_blank");
      }, 2000);
    } catch (error) {
      console.error("Error con Mercado Pago:", error);
      toast.error("Error procesando pago con Mercado Pago");
    } finally {
      setLoading(false);
    }
  };

  const handleUSDCPayment = async () => {
    if (!publicKey) {
      toast.error("Conecta tu wallet Phantom antes de pagar.");
      return;
    }

    try {
      setLoading(true);
      toast.info("Preparando pago con USDC...");

      const { data } = await axios.post(
        `${API_URL}/payments/prepare`,
        { reservationId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

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

      await axios.post(
        `${API_URL}/payments/confirm`,
        { reservationId, signature },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("✅ Pago confirmado correctamente");
      setSuccess(true);

      setQrData(
        JSON.stringify({
          id: reservationId,
          signature,
          status: "PAID",
          method: "USDC",
        })
      );
    } catch (error) {
      console.error("Error con pago USDC:", error);
      toast.error("Error procesando pago con USDC");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <p className="mt-4">Cargando información de pago...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 flex flex-col items-center justify-center p-6">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(1200px 600px at -10% -20%, rgba(255, 255, 255, 0.1), transparent 60%), radial-gradient(900px 500px at 110% 10%, rgba(255, 255, 255, 0.1), transparent 60%)",
          }}
        />
        <div className="max-w-md w-full bg-white/20 backdrop-blur-sm border border-white/30 p-8 rounded-2xl shadow-xl text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
            <span className="text-2xl">✅</span>
          </div>
          <h1 className="text-3xl font-bold mb-4 text-white">¡Pago Confirmado!</h1>
          <p className="text-lg text-white/80 mb-4">
            {reservation?.court.club.name} — {reservation?.court.name}
          </p>
          {qrData && (
            <div className="bg-white/20 p-4 rounded-lg mb-6">
              <QRCode value={qrData} size={180} />
              <p className="text-sm mt-2 text-white/80">Código QR de confirmación</p>
            </div>
          )}
          <button
            onClick={() => router.push("/reservations")}
            className="w-full py-3 rounded-xl bg-white/20 text-white border border-white/30 font-semibold hover:bg-white/30"
          >
            📅 Ver mis reservas
          </button>
          <button
            onClick={() => router.push("/home")}
            className="w-full py-3 mt-2 rounded-xl bg-white/20 text-white border border-white/30 text-sm hover:bg-white/30"
          >
            ← Volver al Inicio
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 flex flex-col items-center justify-center p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(1200px 600px at -10% -20%, rgba(255, 255, 255, 0.1), transparent 60%), radial-gradient(900px 500px at 110% 10%, rgba(255, 255, 255, 0.1), transparent 60%)",
        }}
      />
      <div className="max-w-md w-full bg-white/20 backdrop-blur-sm border border-white/30 p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-4">
            <span className="text-xl">💳</span>
          </div>
          <h1 className="text-3xl font-bold mb-2 text-white">Procesar Pago</h1>
          <p className="text-sm text-white/80">Completa tu pago para confirmar la reserva</p>
        </div>

        {reservation && (
          <div className="mb-8 p-4 rounded-xl bg-white/20 backdrop-blur-sm">
            <h3 className="font-semibold mb-2 text-white">
              {reservation.court.club.name} — {reservation.court.name}
            </h3>
            <p className="text-sm mb-2 text-white/80">
              {reservation.timeslot.startTime} - {reservation.timeslot.endTime}
            </p>
            <p className="text-lg font-bold text-white">
              ${(reservation.totalCents / 100).toFixed(2)} {reservation.currency}
            </p>
          </div>
        )}

        <div className="space-y-4">
          {paymentMethod === "FIAT" && (
            <button
              onClick={handleMercadoPagoPayment}
              disabled={loading}
              className="w-full py-4 rounded-xl bg-white/20 text-white border border-white/30 font-semibold hover:bg-white/30 disabled:opacity-50"
            >
              {loading ? "⏳ Procesando..." : "💳 Pagar con Mercado Pago"}
            </button>
          )}

          {paymentMethod === "USDC" && (
            <button
              onClick={handleUSDCPayment}
              disabled={loading || !publicKey}
              className="w-full py-4 rounded-xl bg-white/20 text-white border border-white/30 font-semibold hover:bg-white/30 disabled:opacity-50"
            >
              {loading ? "⏳ Procesando..." : "💰 Pagar con USDC (Solana)"}
            </button>
          )}

          {paymentMethod === "USDC" && !publicKey && (
            <p className="text-sm text-center text-white/80">
              Conecta tu wallet Phantom para pagar con USDC
            </p>
          )}
        </div>

        <div className="mt-6 space-y-3">
          <button
            onClick={() => router.push("/home")}
            className="w-full px-4 py-2 bg-white/20 text-white border border-white/30 text-sm font-semibold rounded-lg hover:bg-white/30"
          >
            ← Volver al Inicio
          </button>
        </div>
      </div>
    </main>
  );
}

// ============================================================
// ✅ Envolvemos todo en <Suspense> para evitar el error de build
// ============================================================
export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="text-center text-white mt-10">Cargando...</div>}>
      <PaymentPageContent />
    </Suspense>
  );
}
