import { JwtPayload } from '../../auth/types/jwt-payload';

export type RequestWithJwtPayload = Request & {
  user: JwtPayload;
};
