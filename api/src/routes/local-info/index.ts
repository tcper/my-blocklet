import middleware from '@blocklet/sdk/lib/middlewares';
import { Router } from 'express';
import $get from './$get';
import $put from './$put';

const userRouter = Router();

userRouter.get('/', middleware.user(), $get);
userRouter.put('/', middleware.user(), $put);

export default userRouter;
