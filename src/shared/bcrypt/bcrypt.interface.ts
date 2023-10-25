export interface IBcryptService {
  hashPassword(password: string): Promise<string>;
  comparePassword(plainTextPassword: string, hashedPassword: string): Promise<boolean>;
}
