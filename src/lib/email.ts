// Mock email service (Resend removed)

// Email types
export enum EmailType {
  WELCOME = 'welcome',
  REGISTRATION_CONFIRMATION = 'registration_confirmation',
  PAYMENT_SUCCESS = 'payment_success',
  COMPETITION_REMINDER = 'competition_reminder',
  NEWSLETTER = 'newsletter',
  PASSWORD_RESET = 'password_reset',
  CLUB_INVITE = 'club_invite'
}

// Mock email interfaces
export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface SendEmailProps {
  to: string | string[];
  type: EmailType;
  data: Record<string, any>;
  attachments?: any[];
}

// Mock email sending function
export async function sendEmail(props: SendEmailProps): Promise<{ success: boolean; messageId?: string; error?: string }> {
  console.log(`📧 Mock email sent: ${props.type} to ${props.to}`);
  return { success: true, messageId: 'mock-email-id' };
}

// Mock email service
export const EmailService = {
  sendEmail,
  sendWelcomeEmail: async (userEmail: string, userData: any) => ({ success: true, messageId: 'mock-welcome' }),
  sendRegistrationConfirmation: async (userEmail: string, competitionData: any) => ({ success: true, messageId: 'mock-registration' }),
  sendPaymentSuccess: async (userEmail: string, paymentData: any) => ({ success: true, messageId: 'mock-payment' }),
  sendCompetitionReminder: async (userEmail: string, reminderData: any) => ({ success: true, messageId: 'mock-reminder' }),
  sendNewsletter: async (recipients: string[], newsletterData: any) => ({ success: true, messageId: 'mock-newsletter' }),
  sendBulkEmails: async (emails: any[]) => ({ total: emails.length, successful: emails.length, failed: 0, results: [] })
};

// Mock validation function
export function validateEmailAddress(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Mock function
export async function getUserEmailsByRole(role: string): Promise<string[]> {
  return [];
}

export default EmailService;
