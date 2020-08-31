import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';
import AppError from '@shared/errors/AppError';

describe('ShowProfile', () => {
  let fakeUsersRepository: FakeUsersRepository;
  let showProfile: ShowProfileService;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    showProfile = new ShowProfileService(
      fakeUsersRepository
    );
  });

  it('should be able to show user profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });

    const showedUser = await showProfile.execute({
      user_id: user.id,
    });

    expect(showedUser.name).toBe('John Doe');
  });

  it('should not be able to show profile from non-existing user', async () => {
    await expect(showProfile.execute({
      user_id: 'non-existing-user-id',
    })).rejects.toBeInstanceOf(AppError);
  });
});