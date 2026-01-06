import express from "express";
import { registerValidator } from "../validators/auth.validator.js";

import { validate } from "../middleware/validate.js";
import {
  createOrGetConversation,
  getMessages,
} from "../controllers/chat.controller.js";

const router = express.Router();

router.post("/conversation",registerValidator,validate, createOrGetConversation);
router.get("/messages/:conversationId",registerValidator,validate,  getMessages);

export default router;
