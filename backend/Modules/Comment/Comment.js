import { Router } from "express";
import isAdmin from "../../Middlewares/isAdmin.js";
import isLogin from "../../Middlewares/isLogin.js";
import { handleValidationErrors } from "../../Utils/handleValidationError.js";
import {
  changePublish,
  create,
  getAll,
  getAllCommentsPost,
  remove,
  reply,
} from "./CommentCn.js";

import {
  getAllCommentValidator,
  createCommentValidator,
  replyCommentValidator,
  changePublishValidator,
  removeCommentValidator,
  productIdParam,
} from "./CommentValidator.js";

const commentRouter = Router();

commentRouter
  .route("/")
  .get(isAdmin, getAllCommentValidator, handleValidationErrors, getAll)
  .post(isLogin, createCommentValidator, handleValidationErrors, create);

commentRouter
  .route("/reply")
  .post(isAdmin, replyCommentValidator, handleValidationErrors, reply);

commentRouter
  .route("/:id")
  .get(productIdParam, handleValidationErrors, getAllCommentsPost)
  .patch(isAdmin, changePublishValidator, handleValidationErrors, changePublish)
  .delete(isAdmin, removeCommentValidator, handleValidationErrors, remove);

export default commentRouter;
