import { Injectable, Logger } from '@nestjs/common';
import { AppConfigService } from '../../infrastructure/config/services/config.service';

/**
 * Thin wrapper over the Resend HTTP API (no SDK dependency — plain fetch).
 * Swap the implementation here if you switch providers; callers only see `send()`.
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly config: AppConfigService) {}

  async send(to: string, subject: string, html: string): Promise<void> {
    const { resendApiKey, fromAddress } = this.config.mail;

    if (!resendApiKey) {
      this.logger.warn(
        `RESEND_API_KEY not configured — would have sent "${subject}" to ${to}`,
      );
      return;
    }

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ from: fromAddress, to, subject, html }),
      });

      if (!response.ok) {
        const body = await response.text();
        this.logger.error(
          `Failed to send email to ${to}: ${response.status} ${body}`,
        );
      }
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}: ${String(error)}`);
    }
  }
}
