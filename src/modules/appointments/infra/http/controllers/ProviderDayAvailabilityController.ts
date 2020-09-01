import { Request, Response } from 'express';

import { container } from 'tsyringe';
import ListProvidersDayAvailabilityService from '@modules/appointments/services/ListProvidersDayAvailabilityService';

export default class ProviderDayAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;
    const { day, month, year } = request.query;

    const listProvidersDayAvailability = container.resolve(ListProvidersDayAvailabilityService);

    const availability = await listProvidersDayAvailability.execute({
      provider_id,
      year: Number(year),
      month: Number(month),
      day: Number(day),
    });

    return response.json(availability);
  }
}
