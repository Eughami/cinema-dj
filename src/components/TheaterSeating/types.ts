export type SeatStatus = 'available' | 'selected' | 'reserved';

export interface Seat {
  id: string;
  status: SeatStatus;
}

export interface SeatsMap {
  [rowId: string]: Seat[];
}