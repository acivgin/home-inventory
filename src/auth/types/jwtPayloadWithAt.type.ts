import { JwtPayload } from '.';

/**
 * Represents a JWT payload with a access token.
 */
export type JwtPayloadWithAt = JwtPayload & { accessToken: string };
