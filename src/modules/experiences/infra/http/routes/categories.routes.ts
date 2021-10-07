import { Router } from "express";

import ensureAuthenticated from "@modules/users/infra/http/middleware/ensureAuthenticated";

import CategoriesController from "../controllers/CategoriesController";

const categoriesRouter = Router();
const categoriesController = new CategoriesController();

categoriesRouter.use(ensureAuthenticated);

categoriesRouter.get(
  '/',
  categoriesController.index
);

export default categoriesRouter;
