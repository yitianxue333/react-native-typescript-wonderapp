interface ChatResponseMessage {
  id: number;
  sender_id: number;
  recipient_id: number;
  text: string;
  body: string;
  aasm_state?: string;
  state?: string;
  created_at: string;
  sent_at: string;
  delivered_at: string;
  read_at: string;
}
export default ChatResponseMessage;
