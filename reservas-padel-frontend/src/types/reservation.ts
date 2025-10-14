// src/types/reservation.ts
export interface Club {
  id: string;
  name: string;
  city: string;
  zone: string;
}

export interface Court {
  id: string;
  name: string;
  surface: string;
  basePrice: number;
  currency: string;
  club: Club;
}

export interface Timeslot {
  id: string;
  startTime: string;
  endTime: string;
}

export interface Reservation {
  id: string;
  status: "PENDING" | "PAID" | "CANCELLED";
  totalCents: number;
  currency: string;
  createdAt: string;
  court: Court;
  timeslot: Timeslot;
}
