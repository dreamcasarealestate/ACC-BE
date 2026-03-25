import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const normalizedEmail = String(email || '').trim().toLowerCase();
    if (!normalizedEmail) return null;
    return this.usersRepository
      .createQueryBuilder('user')
      .where('LOWER(user.email) = :email', { email: normalizedEmail })
      .getOne();
  }

  async findByResetPasswordToken(token: string): Promise<User | null> {
    const normalizedToken = String(token || '').trim();
    if (!normalizedToken) return null;
    return this.usersRepository.findOneBy({ resetPasswordToken: normalizedToken });
  }

  async create(user: Partial<User>): Promise<User> {
    const newUser = this.usersRepository.create({
      ...user,
      email: user.email?.trim().toLowerCase(),
      phone: user.phone?.trim(),
    });
    return this.usersRepository.save(newUser);
  }

  async findAll() {
    return this.usersRepository.find();
  }

  async update(id: number, payload: Partial<User>) {
    await this.usersRepository.update(id, {
      ...payload,
      email: payload.email?.trim().toLowerCase(),
      phone: payload.phone?.trim(),
    });
    return this.usersRepository.findOneBy({ id });
  }

  async remove(id: number) {
    return this.usersRepository.delete(id);
  }
}
