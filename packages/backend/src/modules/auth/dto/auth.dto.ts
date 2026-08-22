import { LoginDto as SharedLoginDto, RegisterDto as SharedRegisterDto } from '@shared/dto';
import { IsString, IsEmail, MinLength, IsNotEmpty } from 'class-validator';

export class LoginDto extends SharedLoginDto {
  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class RegisterDto extends SharedRegisterDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  username!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string;

  @IsString()
  @IsNotEmpty()
  confirm!: string;
}
