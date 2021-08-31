import { Router } from "express";

import usersRouter from "@modules/users/infra/http/routes/users.routes";
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import profileRouter from '@modules/users/infra/http/routes/profile.routes';
import passwordRouter from "@modules/users/infra/http/routes/password.routes";
import hostRouter from "@modules/users/infra/http/routes/host.routes";
import adminRouter from "@modules/admin/infra/http/routes/admin.routes";
import experiencesRouter from "@modules/experiences/infra/http/routes/experiences.routes";
import appointmentsRouter from "@modules/appointments/infra/http/routes/appointments.routes";
import reviewsRouter from "@modules/reviews/infra/http/routes/reviews.routes";

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/profile', profileRouter);
routes.use('/password', passwordRouter);
routes.use('/hosts', hostRouter);
routes.use('/admin', adminRouter);
routes.use('/experiences', experiencesRouter);
routes.use('/appointments', appointmentsRouter);
routes.use('/reviews', reviewsRouter);

export default routes;
