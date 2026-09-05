import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: jest.Mocked<Partial<UsersService>>;
  let jwtService: jest.Mocked<Partial<JwtService>>;

  beforeEach(async () => {
    // 1. สร้างตัวปลอม (Mock) สำหรับ Services ที่ถูกเรียกใช้
    const mockUsersService = {
      findForLogin: jest.fn(),
      findByUsername: jest.fn(),
      findByEmail: jest.fn(),
    };
    const mockJwtService = {
      signAsync: jest.fn(),
    };

    // 2. จัดเตรียม Test Module
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login()', () => {
    it('ควร Login สำเร็จและคืนค่า access_token ถ้าอีเมลและรหัสถูกต้อง', async () => {
      // จัดฉาก (Arrange)
      const loginDto = { email: 'test@mail.com', password: 'password123' };
      const fakeUser = {
        id: '1',
        username: 'testuser',
        email: 'test@mail.com',
        role: 'USER',
        accounts: [
          {
            id: 'acc-1',
            provider: 'LOCAL',
            password: 'hashedpassword',
          },
        ],
      };

      // สั่งให้ UsersService ตัวปลอม คืนค่า fakeUser กลับมาเสมอ
      (usersService.findForLogin as jest.Mock).mockResolvedValue(fakeUser);

      // สั่งให้ bcrypt (จำลอง) คืนค่า true เสมอ (แปลว่ารหัสผ่านตรง)
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      // สั่งให้ JwtService ตัวปลอม คืนค่า 'fake_token' เสมอ
      (jwtService.signAsync as jest.Mock).mockResolvedValue('fake_token');

      // ลงมือทำ (Act)
      const result = await authService.login(loginDto);

      // ตรวจสอบ (Assert)
      expect(result).toEqual({
        access_token: 'fake_token',
        user: {
          id: '1',
          email: 'test@mail.com',
          username: 'testuser',
          role: 'USER',
        },
      });
      // ตรวจสอบว่ามันถูกเรียกใช้งานจริงๆ
      expect(usersService.findForLogin).toHaveBeenCalledWith(
        loginDto.email,
      );
    });

    it('ควร Error ถ้าไม่พบอีเมลในระบบ', async () => {
      // จัดฉากให้หาผู้ใช้ไม่เจอ
      (usersService.findForLogin as jest.Mock).mockResolvedValue(null);

      // ตรวจสอบว่าต้องโยน UnauthorizedException ออกมา
      await expect(
        authService.login({
          email: 'nonexistent@mail.com',
          password: 'password123',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('ควร Error ถ้ารหัสผ่านไม่ถูกต้อง', async () => {
      const fakeUser = {
        id: '1',
        username: 'testuser',
        email: 'test@mail.com',
        role: 'USER',
        accounts: [{ id: 'acc-1', provider: 'LOCAL', password: 'hashedpassword' }],
      };

      (usersService.findForLogin as jest.Mock).mockResolvedValue(fakeUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.login({
          email: 'test@mail.com',
          password: 'wrongpassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
