export interface ChatUser {
  _id: number;
  name: string;
  avatar?: string;
}

interface GiftedChatMessage {
  _id: number;
  text: string;
  createdAt: Date;
  user?: ChatUser;
  system?: boolean;
}

export default GiftedChatMessage;
