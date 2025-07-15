// Mock email service (Resend removed)

// Mock email templates
export const emailTemplates = {
  roleRequestApproved: (data: any) => ({
    subject: '🎉 Ваш запит на роль схвалено - ФУСАФ',
    html: '',
    text: ''
  }),
  roleRequestRejected: (data: any) => ({
    subject: '❌ Ваш запит на роль відхилено - ФУСАФ',
    html: '',
    text: ''
  })
};

// Mock email sending function
export async function sendRoleStatusEmail(
  userEmail: string,
  status: 'approved' | 'rejected',
  data: any
) {
  console.log(`📧 Mock email: ${status} для ${userEmail}`);
  return { success: true, emailId: 'mock-email-id' };
}

// Mock test function
export async function testEmailService() {
  return { success: true, emailId: 'mock-test-email-id' };
}
