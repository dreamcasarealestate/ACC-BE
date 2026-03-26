import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { User, UserRole } from '../users/entities/user.entity';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async register(user: Partial<User>) {
    const existing = await this.usersService.findByEmail(user.email!);
    if (existing) throw new ConflictException('Email already exists');
    if (!user.role) user.role = UserRole.SUPERVISOR;
    return this.usersService.create(user);
  }

  async login(loginDto: LoginDto) {
    const email = String(loginDto.email || '').trim().toLowerCase();
    const inputPassword = String(loginDto.password || '');
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    // For prototyping we check raw text, ideally use bcrypt.compare
    const storedPassword = String(user.password || '');
    const isMatch = inputPassword === storedPassword || inputPassword.trim() === storedPassword.trim();
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, name: user.name, role: user.role }
    };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const email = String(dto.email || '').trim().toLowerCase();
    const newPassword = String(dto.newPassword || '').trim();
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new BadRequestException('User with this email does not exist');
    }

    await this.usersService.update(user.id, {
      password: newPassword,
      resetPasswordToken: null,
      resetPasswordExpiresAt: null,
    });

    return { message: 'Password updated successfully. Please login.' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const token = String(dto.token || '').trim();
    const newPassword = String(dto.newPassword || '').trim();
    if (!token || !newPassword) {
      throw new BadRequestException('Token and newPassword are required');
    }

    const user = await this.usersService.findByResetPasswordToken(token);
    if (!user?.resetPasswordExpiresAt || user.resetPasswordExpiresAt.getTime() < Date.now()) {
      throw new BadRequestException('Reset token is invalid or expired');
    }

    await this.usersService.update(user.id, {
      password: newPassword,
      resetPasswordToken: null,
      resetPasswordExpiresAt: null,
    });
    return { message: 'Password reset successful' };
  }

}
