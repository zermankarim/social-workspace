export type SendMessageAttachmentInput = {
  url: string;
  ciphertextSize?: number | null;
};

export type SendMessageInput = {
  ciphertext: string;
  nonce: string;
  senderDeviceId: string;
  keyVersion?: number;
  attachments?: SendMessageAttachmentInput[];
};
