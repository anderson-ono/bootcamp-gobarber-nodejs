import { injectable, inject } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
  day: number;
}

type IResponse = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
class ListProvidersDayAvailabilityService {
   constructor(
     @inject('AppointmentsRepository')
     private appointmentsRepository: IAppointmentsRepository,

     @inject('CacheProvider')
    private cacheProvider:ICacheProvider,
   ) {}

  public async execute({ provider_id, month, year, day }: IRequest): Promise<IResponse> {
    //let appointments = await this.cacheProvider.recover<Appointment[]>(`providers-list:${user_id}`);


    const appointments = await this.appointmentsRepository.findAllInDayFromProvider({
      provider_id, month, year, day
    });

    const hourStart = 8;
    const eachHourArray = Array.from(
      { length: 10 },
      (value, index) => index + hourStart,
    );

    const availability = eachHourArray.map(hour => {
      const hasAppointmentInHour = appointments.find(appointment =>
        getHours(appointment.date) === hour
      );

      const currentDate = new Date(Date.now());
      const compareDate = new Date(year, month - 1, day, hour);

      return {
        hour,
        available: !hasAppointmentInHour && isAfter(compareDate, currentDate),
      }
    });

    return availability;
  }
}

export default ListProvidersDayAvailabilityService ;
