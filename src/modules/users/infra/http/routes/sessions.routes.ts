import { Router } from 'express';
import SessionsController from '../controllers/SessionsController';

const userRouter = Router();
const sessionsController = new SessionsController();

userRouter.post('/', sessionsController.create);

export default userRouter;
