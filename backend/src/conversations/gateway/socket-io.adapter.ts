import { INestApplication } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions } from 'socket.io';
import type { CorsOptions } from 'cors';

export class SocketIoAdapter extends IoAdapter {
  constructor(
    app: INestApplication,
    private readonly allowedOrigins: string[],
    private readonly credentials: boolean,
  ) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions): Server {
    const cors: CorsOptions = {
      origin: (
        origin: string | undefined,
        callback: (err: Error | null, allow?: boolean | string) => void,
      ) => {
        if (!origin) {
          callback(null, true);
          return;
        }
        callback(null, this.allowedOrigins.includes(origin.trim()));
      },
      credentials: this.credentials,
    };

    return super.createIOServer(port, {
      ...options,
      cors,
    }) as Server;
  }
}
