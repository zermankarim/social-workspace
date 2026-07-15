import { DefaultEventsMap, Socket, Server } from 'socket.io';

export type MessagingSocketData = {
  userId?: string;
};

export type MessagingSocket = Socket<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  MessagingSocketData
>;

export type MessagingServer = Server<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  MessagingSocketData
>;
