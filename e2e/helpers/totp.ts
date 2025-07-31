import { authenticator } from 'otplib';

/**
 * Generates a TOTP code for the given secret.
 * @param secret The TOTP shared secret (base32 encoded)
 */
export function getTOTP(secret: string): string {
    console.log('Generating TOTP for secret:', secret);
    console.log('Generating TOTP for secret:', authenticator.generate(secret));

  return authenticator.generate(secret);
}