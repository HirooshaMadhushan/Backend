import { ChatService } from "../services/chat.service.js";

const chatService = ChatService.getInstance();

export const createOrGetConversation = (req, res) => {
  const { userId } = req.user;
  const { otherUserId } = req.body;

  const conv = chatService.getOrCreateConversation(userId, otherUserId);

  res.json(conv);
};

export const getMessages = (req, res) => {
  const { conversationId } = req.params;
  const messages = chatService.getMessages(conversationId);
  res.json(messages);
};
