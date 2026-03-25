import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { User, UserRole } from '../users/entities/user.entity';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { randomBytes } from 'crypto';
import nodemailer from 'nodemailer';

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
    const user = await this.usersService.findByEmail(email);

    // Always return the same response to avoid email enumeration.
    if (!user) {
      return { message: 'If the email exists, a reset link has been sent.' };
    }

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await this.usersService.update(user.id, {
      resetPasswordToken: token,
      resetPasswordExpiresAt: expiresAt,
    });

    try {
      await this.sendResetPasswordEmail(email, token);
    } catch (error) {
      await this.usersService.update(user.id, {
        resetPasswordToken: null,
        resetPasswordExpiresAt: null,
      });
      throw error;
    }

    return { message: 'If the email exists, a reset link has been sent.' };
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

  private async sendResetPasswordEmail(email: string, token: string) {
    const baseUrl = (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/+$/, '');
    const resetLink = `${baseUrl}/reset-password?token=${encodeURIComponent(token)}`;
    const host = String(process.env.SMTP_HOST || '').trim();
    const user = String(process.env.SMTP_USER || '').trim();
    const pass = String(process.env.SMTP_PASS || '').trim();
    const from = String(process.env.MAIL_FROM || user || '').trim();
    const port = Number(process.env.SMTP_PORT || 587);
    const secure = String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true';

    if (!host || !user || !pass || !from) {
      throw new InternalServerErrorException(
        'Mail service is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM.',
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from,
      to: email,
      subject: 'Reset your ACC Constructions password',
      text: `Use this link to reset your password: ${resetLink}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>ACC Constructions</h2>
          <p>We received a request to reset your password.</p>
          <p>
            <a href="${resetLink}" style="background:#2563eb;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;display:inline-block;">
              Reset Password
            </a>
          </p>
          <p>If you did not request this, you can ignore this email.</p>
          <p>This link expires in 15 minutes.</p>
        </div>
      `,
    });
  }
}
