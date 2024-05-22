import type { Request, Response } from 'express';
import { authService } from '../../libs/auth';
import models from '../../models';

export default async function $get(req: Request, res: Response) {
  // not login
  if (!req.user) {
    return res.status(404).send('DID Spaces endpoint does not exist. Log in again to complete the authorization');
  }
  const { user } = await authService.getUser(req.user?.did as string);
  if (!user?.didSpace?.endpoint) {
    return res.status(404).send('DID Spaces endpoint does not exist. Log in again to complete the authorization');
  }
  // logined logic
  try {
    // I think did is a unique ID, so I use it as the key
    const result = await models.models.User?.findOne({ where: { did: user.did } });
    if (!result) {
      return res.json({
        user: {
          did: user.did,
          name: user.fullName,
          email: user.email,
          phone: '',
        },
      });
    }

    const info = JSON.parse(result.dataValues.info);
    return res.json({
      user: {
        did: user.did,
        ...info,
      },
    });
  } catch (error) {
    if (error.message.includes('404')) {
      return res.json({ userInfo: [] });
    }
    console.error(error);
    return res.status(400).send(error.message);
  }
}
