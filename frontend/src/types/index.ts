export type Room = {
  id: number;
  name: string;
};

export type Staff = {
  id: number;
  name: string;
  department: string | null;
};

export type Reservation = {
  id: number;
  title: string;
  memo: string | null;
  room: Room | null;
  staffs: Staff[];
  start_time: string;
  end_time: string;
};
