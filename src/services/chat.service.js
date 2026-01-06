export class ChatService {
  constructor() {
    this.conversations = [];
    this.messages = [];
  }

  static getInstance() {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  // Find or create conversation between 2 users
  getOrCreateConversation(userA, userB) {
    let conv = this.conversations.find(
      (c) =>
        c.participants.includes(userA) && c.participants.includes(userB)
    );

    if (!conv) {
      conv = {
        id: String(Date.now()),
        participants: [userA, userB],
      };
      this.conversations.push(conv);
    }

    return conv;
  }

  saveMessage({ conversationId, from, to, content }) {
    const msg = {
      id: String(Date.now()),
      conversationId,
      from,
      to,
      content,
      createdAt: new Date(),
    };
    this.messages.push(msg);
    return msg;
  }

  getMessages(conversationId) {
    return this.messages.filter((m) => m.conversationId === conversationId);
  }
}
