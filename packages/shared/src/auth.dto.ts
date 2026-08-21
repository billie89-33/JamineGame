export class RegisterDto {
  username!: string;
  email!: string;
  password!: string;
  confirm!: string;
}

export class LoginDto {
  username!: string;
  password!: string;
}
