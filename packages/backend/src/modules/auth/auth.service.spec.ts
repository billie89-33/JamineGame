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
      findByUsername: jest.fn(),
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
      const loginDto = { username: 'testuser', password: 'password123' };
      const fakeUser = { id: '1', username: 'testuser', email: 'test@mail.com', password: 'hashedpassword', role: 'USER' };
      
      // สั่งให้ UsersService ตัวปลอม คืนค่า fakeUser กลับมาเสมอ
      usersService.findByUsername.mockResolvedValue(fakeUser as any);
      
      // สั่งให้ bcrypt (จำลอง) คืนค่า true เสมอ (แปลว่ารหัสผ่านตรง)
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      
      // สั่งให้ JwtService ตัวปลอม คืนค่า 'fake_token' เสมอ
      jwtService.signAsync.mockResolvedValue('fake_token');

      // ลงมือทำ (Act)
      const result = await authService.login(loginDto as any);

      // ตรวจสอบ (Assert)
      expect(result).toEqual({
        access_token: 'fake_token',
        user: { id: '1', email: 'test@mail.com', username: 'testuser', role: 'USER' }
      });
      // ตรวจสอบว่ามันถูกเรียกใช้งานจริงๆ
      expect(usersService.findByUsername).toHaveBeenCalledWith(loginDto.username);
    });

    it('ควร Error ถ้าไม่พบอีเมลในระบบ', async () => {
      // จัดฉากให้หาผู้ใช้ไม่เจอ
      usersService.findByUsername.mockResolvedValue(null);

      // ตรวจสอบว่าต้องโยน UnauthorizedException ออกมา
      await expect(authService.login({ username: 'testuser', password: 'password123' } as any))
        .rejects.toThrow(UnauthorizedException);
    });
  });
});
