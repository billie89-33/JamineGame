import {
  LoginDto as SharedLoginDto,
  RegisterDto as SharedRegisterDto,
} from '@shared/dto';
import { IsString, IsEmail, MinLength, IsNotEmpty } from 'class-validator';

export class LoginDto extends SharedLoginDto {
  @IsString()
  @IsNotEmpty()
  declare username: string;

  @IsString()
  @IsNotEmpty()
  declare password: string;
}

export class RegisterDto extends SharedRegisterDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  declare username: string;

  @IsEmail()
  @IsNotEmpty()
  declare email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  declare password: string;

  @IsString()
  @IsNotEmpty()
  declare confirm: string;
}
