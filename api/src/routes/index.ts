import middleware from '@blocklet/sdk/lib/middlewares';
import { Router } from 'express';
import localInfo from './local-info';

const router = Router();

router.use('/user', middleware.user(), (req, res) => res.json(req.user || {}));
router.use('/local-info', middleware.user(), localInfo);

export default router;
