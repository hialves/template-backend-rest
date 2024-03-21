export interface MailService {
  sendMail(data: { to: string; subject: string; html: any }): Promise<boolean>;
}
