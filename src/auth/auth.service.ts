import {
  Injectable,
  NotFoundException,
  Logger,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '@auth/schemas/user.schema';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '@auth/dto/createUser.dto';
import { LoginDto } from '@auth/dto/login.dto';
import { AuthResponse } from '@auth/types/auth.types';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '@app/repository/user.repository';
import { UserService } from '@app/user/user.service';

@Injectable()
export class AuthService {
  // logger below
  private readonly logger;

  // Injecting Model
  constructor(
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.logger = new Logger(AuthService.name);
  }

  public async signUp(createUserDto: CreateUserDto): Promise<AuthResponse> {
    try {
      const user = await this.userRepository.create(createUserDto);

      // token handling below
      const token = this.generateToken((user as any)._id as any);

      // Exclude sensitive fields (e.g., password) from the user object
      const { password, ...userWithoutPassword } = user;

      return {
        message: 'User Registered Success',
        user: userWithoutPassword,
        token,
      };
    } catch (error) {
      console.log(error);
      if (error.code === 11000 || error.code === 11001) {
        // MongoDB duplicate key error (code 11000 or 11001)
        throw new ConflictException('Email already exists.');
      }
      throw new UnauthorizedException(
        'An error occurred while registering the user',
      );
    }
  }

  public async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.userRepository.findByEmail(loginDto.email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordMatch = await compare(loginDto.password, user.password);

    if (!isPasswordMatch) {
      throw new NotFoundException('Invalid login credentials');
    }

    // token handling below
    const token = this.generateToken((user as any)._id as any);

    // Exclude sensitive fields (e.g., password) from the user object
    const { password, ...userWithoutPassword } = user;

    return { message: 'User Login Success', user: userWithoutPassword, token };
  }

  private generateToken(payload: string): string {
    try {
      const token = this.jwtService.sign({ _id: payload });

      return token;
    } catch (error) {
      console.log(error);
      this.logger.error(
        `An error occurred while generating token: ${error.message}`,
      );
      throw new Error('An error occurred while generating token');
    }
  }

  public async verifyToken(token: string) {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
    return payload;
  }
}
