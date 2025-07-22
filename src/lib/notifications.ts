interface EmailNotificationData {
  action: string;
  actorName: string;
  actorEmail: string;
  targetName?: string;
  targetEmail?: string;
  details?: Record<string, unknown>;
  timestamp: Date;
}

interface SlackNotificationData {
  action: string;
  actorName: string;
  targetName?: string;
  details?: Record<string, unknown>;
  timestamp: Date;
}

// Email notification service (using native fetch)
export class EmailNotificationService {
  async sendHighRiskAlert(data: EmailNotificationData): Promise<void> {
    try {
      // In a real application, you would integrate with your email service
      // For now, we'll log and could integrate with services like SendGrid, Mailgun, etc.
      console.log('📧 EMAIL NOTIFICATION SENT:');
      console.log('Subject:', `🚨 High-Risk Admin Action: ${data.action}`);
      console.log('To:', process.env.ADMIN_ALERT_EMAIL || 'admin@yourcompany.com');
      console.log('Content:', this.generateEmailContent(data));
      
      // Example SendGrid integration (commented out - requires API key)
      /*
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personalizations: [{
            to: [{ email: process.env.ADMIN_ALERT_EMAIL || 'admin@yourcompany.com' }]
          }],
          from: { email: process.env.FROM_EMAIL || 'noreply@yourcompany.com' },
          subject: `🚨 High-Risk Admin Action: ${data.action}`,
          content: [{
            type: 'text/html',
            value: this.generateEmailHTML(data)
          }]
        })
      });
      */
      
    } catch (error) {
      console.error('Failed to send email notification:', error);
      // Don't throw error to prevent disrupting main operation
    }
  }

  private generateEmailContent(data: EmailNotificationData): string {
    const details = data.details 
      ? Object.entries(data.details)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ')
      : '';

    return `
HIGH-RISK ADMINISTRATIVE ACTION ALERT

Action: ${data.action}
Performed by: ${data.actorName} (${data.actorEmail})
${data.targetName ? `Target User: ${data.targetName} (${data.targetEmail})` : ''}
Timestamp: ${data.timestamp.toLocaleString()}
${details ? `Details: ${details}` : ''}

This action has been logged in the audit trail. Please review the admin dashboard for more details.

This is an automated notification from your application security system.
    `;
  }

  private generateEmailHTML(data: EmailNotificationData): string {
    const detailsHtml = data.details 
      ? Object.entries(data.details)
          .map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`)
          .join('')
      : '';

    return `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #dc2626; color: white; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
              <h2 style="margin: 0;">🚨 High-Risk Administrative Action Alert</h2>
            </div>
            
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
              <h3 style="color: #dc2626; margin-top: 0;">Action Details</h3>
              <ul style="list-style: none; padding: 0;">
                <li style="margin-bottom: 10px;"><strong>Action:</strong> ${data.action}</li>
                <li style="margin-bottom: 10px;"><strong>Performed by:</strong> ${data.actorName} (${data.actorEmail})</li>
                ${data.targetName ? `<li style="margin-bottom: 10px;"><strong>Target User:</strong> ${data.targetName} (${data.targetEmail})</li>` : ''}
                <li style="margin-bottom: 10px;"><strong>Timestamp:</strong> ${data.timestamp.toLocaleString()}</li>
              </ul>
            </div>

            ${detailsHtml ? `
              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
                <h3 style="color: #374151; margin-top: 0;">Additional Details</h3>
                <ul style="list-style: none; padding: 0;">
                  ${detailsHtml}
                </ul>
              </div>
            ` : ''}

            <div style="background-color: #fef3c7; padding: 15px; border-radius: 5px; border-left: 4px solid #f59e0b;">
              <p style="margin: 0; color: #92400e;">
                <strong>Security Notice:</strong> This action has been logged in the audit trail. 
                Please review the admin dashboard for more details.
              </p>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280;">
              <p>This is an automated notification from your application security system.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}

// Slack notification service
export class SlackNotificationService {
  private webhookUrl: string;

  constructor() {
    this.webhookUrl = process.env.SLACK_WEBHOOK_URL || '';
  }

  async sendHighRiskAlert(data: SlackNotificationData): Promise<void> {
    if (!this.webhookUrl) {
      console.warn('Slack webhook URL not configured');
      return;
    }

    try {
      const message = this.formatSlackMessage(data);
      
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        throw new Error(`Slack API error: ${response.status}`);
      }

      console.log(`Slack notification sent for action: ${data.action}`);
    } catch (error) {
      console.error('Failed to send Slack notification:', error);
      // Don't throw error to prevent disrupting main operation
    }
  }

  private formatSlackMessage(data: SlackNotificationData) {
    const detailsFields = data.details 
      ? Object.entries(data.details).map(([key, value]) => ({
          type: 'mrkdwn',
          text: `*${key}:* ${value}`
        }))
      : [];

    return {
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '🚨 High-Risk Admin Action Alert',
            emoji: true
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Action:* ${data.action}`
            },
            {
              type: 'mrkdwn',
              text: `*Performed by:* ${data.actorName}`
            },
            ...(data.targetName ? [{
              type: 'mrkdwn',
              text: `*Target User:* ${data.targetName}`
            }] : []),
            {
              type: 'mrkdwn',
              text: `*Timestamp:* ${data.timestamp.toLocaleString()}`
            }
          ]
        },
        ...(detailsFields.length > 0 ? [{
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*Additional Details:*'
          }
        }, {
          type: 'section',
          fields: detailsFields
        }] : []),
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: '🔍 This action has been logged in the audit trail. Review the admin dashboard for more details.'
            }
          ]
        }
      ]
    };
  }
}

// Notification orchestrator
export class NotificationService {
  private emailService: EmailNotificationService;
  private slackService: SlackNotificationService;

  constructor() {
    this.emailService = new EmailNotificationService();
    this.slackService = new SlackNotificationService();
  }

  async sendHighRiskAlert(data: {
    action: string;
    actorName: string;
    actorEmail: string;
    targetName?: string;
    targetEmail?: string;
    details?: Record<string, any>;
  }): Promise<void> {
    const timestamp = new Date();
    
    // Send email notification
    await this.emailService.sendHighRiskAlert({
      ...data,
      timestamp
    });

    // Send Slack notification
    await this.slackService.sendHighRiskAlert({
      action: data.action,
      actorName: data.actorName,
      targetName: data.targetName,
      details: data.details,
      timestamp
    });
  }

  // High-risk actions that should trigger notifications
  static getHighRiskActions(): string[] {
    return [
      'DELETE_USER',
      'UPDATE_ROLE', // When demoting admin to user
      'RESET_PASSWORD',
      'DELETE_ADMIN_USER'
    ];
  }

  static isHighRiskAction(action: string, details?: Record<string, any>): boolean {
    const highRiskActions = this.getHighRiskActions();
    
    // Special case: Only notify for role updates that demote admins
    if (action === 'UPDATE_ROLE' && details) {
      return details.previousRole === 'admin' && details.newRole === 'user';
    }
    
    return highRiskActions.includes(action);
  }
}
