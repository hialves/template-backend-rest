export interface ICreateAdminDto {
  name: string;
  email: string;
  password: string;
}

export interface IUpdateAdminDto extends Partial<ICreateAdminDto> {}
