import User from './user';
export interface ChatUser extends User {
  first_name: string;
}

interface Chat {
  partner: ChatUser;
  newOutgoingMessage: {
    message: {
      text: string;
    };
    recipient_id: number;
  };
  conversationsLib: string[];
  lastReadMessage: {
    last_message: {
      aasm_state: string;
      id: number;
    };
  };
  ghostMessage: {
    ghostMessage: string;
    partner: {
      id: number;
    };
  };
}

export default Chat;
