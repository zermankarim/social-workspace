export type SendMessageAttachmentInput = {
  url: string;
  ciphertextSize?: number | null;
};

export type SendMessageRecipientKeyInput = {
  deviceId: string;
  ciphertext: string;
  nonce: string;
  keyVersion?: number;
};

export type SendMessageInput = {
  senderDeviceId: string;
  recipientKeys: SendMessageRecipientKeyInput[];
  attachments?: SendMessageAttachmentInput[];
};
