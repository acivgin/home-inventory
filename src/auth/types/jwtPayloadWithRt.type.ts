import { JwtPayload } from '.';

/**
 * Represents a JWT payload with a refresh token.
 */
export type JwtPayloadWithRt = JwtPayload & { refreshToken: string };
