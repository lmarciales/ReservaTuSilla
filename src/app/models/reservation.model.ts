import { DateModel, TimeModel } from './date-time.model';

export interface ReservationModel {
  chairId: string;
  userId: string;
  date: DateModel;
  sTime: TimeModel;
  eTime: TimeModel;
}
