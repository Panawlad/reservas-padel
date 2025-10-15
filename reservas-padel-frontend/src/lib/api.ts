import axios from "axios";
import type { Reservation } from "@/types/reservation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

/* === LOGIN / SIGNUP === */
export const login = async (email: string, password: string) => {
  const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });
  return data as {
    message: string;
    user: { id: string; email: string; role: "USER" | "CLUB" | "ADMIN"; name?: string };
    token: string;
  };
};

export const signup = async (email: string, password: string, role: string) => {
  const { data } = await axios.post(`${API_URL}/auth/signup`, { email, password, role });
  return data as {
    message: string;
    user: { id: string; email: string; role: "USER" | "CLUB" | "ADMIN"; name?: string };
    token: string;
  };
};

/* === GET RESERVATIONS === */
export const getReservations = async (token: string): Promise<Reservation[]> => {
  const { data } = await axios.get(`${API_URL}/reservations/my`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};
/* === PAGOS USDC === */
export const preparePayment = async (reservationId: string, token: string) => {
  const { data } = await axios.post(
    `${API_URL}/payments/prepare`,
    { reservationId },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return data;
};

export const confirmPayment = async (reservationId: string, signature: string, token: string) => {
  const { data } = await axios.post(
    `${API_URL}/payments/confirm`,
    { reservationId, signature },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return data;
};

/* === PROFILE === */
export const getProfile = async (token: string) => {
  const { data } = await axios.get(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data as { id: string; email: string; name?: string; role: 'USER' | 'CLUB' | 'ADMIN' };
};