import { Router } from "express";

import ResolveReportsController from "../controllers/ResolveReportsController";

const manageReportsRouter = Router();
const resolveReportsController = new ResolveReportsController();

manageReportsRouter.get(
  '/:report_id',
  resolveReportsController.show
);

manageReportsRouter.put(
  '/:report_id',
  resolveReportsController.update
);

export default manageReportsRouter;
