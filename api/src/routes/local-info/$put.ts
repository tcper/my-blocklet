import type { Request, Response } from 'express';
import { authService } from '../../libs/auth';
import models from '../../models';

export default async function $put(req: Request, res: Response) {
  // no userInfo
  if (!req.body.userInfo) {
    throw new Error('UserInfo must not empty');
  }
  // not logined
  const { user } = await authService.getUser(req.user?.did as string);
  if (!user?.didSpace?.endpoint) {
    return res.status(404).send('DID Spaces endpoint does not exist. Log in again to complete the authorization');
  }
  // logined
  try {
    const result = await models.models.User?.findOne({ where: { did: user.did } });
    if (!result) {
      await models.models.User?.create({
        did: user.did,
        info: JSON.stringify(req.body.userInfo),
      });
      return res.send();
    }
    await models.models.User?.update(
      {
        info: JSON.stringify(req.body.userInfo),
      },
      {
        where: {
          did: user.did,
        },
      }
    );
    return res.send();
  } catch (error) {
    console.error(error);
    return res.status(400).send(error.message);
  }
}
