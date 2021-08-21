import { Router } from "express";

import usersRouter from "@modules/users/infra/http/routes/users.routes";
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import profileRouter from '@modules/users/infra/http/routes/profile.routes';
import passwordRouter from "@modules/users/infra/http/routes/password.routes";
import hostRouter from "@modules/users/infra/http/routes/host.routes";
import adminRouter from "@modules/admin/infra/http/routes/admin.routes";
import experienceRouter from "@modules/experiences/infra/http/routes/experiences.routes"

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/profile', profileRouter);
routes.use('/password', passwordRouter);
routes.use('/host', hostRouter);
routes.use('/admin', adminRouter);
routes.use('/experiences', experienceRouter);

export default routes;
