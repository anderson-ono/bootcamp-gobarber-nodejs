import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProvidersDayAvailabilityService from './ListProvidersDayAvailabilityService';

describe('ListProvidersDayAvailability', () => {
  let fakeAppointmentsRepository: FakeAppointmentsRepository;
  let fakeCacheProvider: FakeCacheProvider;
  let listProvidersDayAvailability: ListProvidersDayAvailabilityService;

  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProvidersDayAvailability = new ListProvidersDayAvailabilityService(
      fakeAppointmentsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list the day availability from provider', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'user-id',
      user_id: 'user-id2',
      date: new Date(2020, 4, 20, 14, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'user-id',
      user_id: 'user-id2',
      date: new Date(2020, 4, 20, 16, 0, 0),
    });

    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 20, 11, 0, 0).getTime();
    })

    const availability = await listProvidersDayAvailability.execute({
      provider_id: 'user-id',
      year: 2020,
      month: 5,
      day: 20
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        {hour: 8,  available: false},
        {hour: 9,  available: false},
        {hour: 10, available: false},
        {hour: 11, available: false },
        {hour: 12, available: true },
        {hour: 13, available: true },
        {hour: 14, available: false},
        {hour: 15, available: true },
        {hour: 16, available: false},
        {hour: 17, available: true },
      ])
    );
  });
});
