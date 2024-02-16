import {
  Injectable,
  NotFoundException,
  Logger,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from '@auth/schemas/user.schema';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '@auth/dto/createUser.dto';
import { LoginDto } from '@auth/dto/login.dto';

@Injectable()
export class AuthService {
  // logger below
  private readonly logger = new Logger(AuthService.name);

  // Injecting Model
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(
    createUserDto: CreateUserDto,
  ): Promise<{ message: string; token: string; user: User }> {
    try {
      const user = await this.userModel.create(createUserDto);

      const token = this.generateToken(user._id as any);

      return { message: 'User Registered Success', user, token };
    } catch (error) {
      if (error.code === 11000 || error.code === 11001) {
        // MongoDB duplicate key error (code 11000 or 11001)
        throw new ConflictException('Email already exists.');
      }
      throw new UnauthorizedException(
        'An error occurred while registering the user',
      );
    }
  }

  async login(loginDto: LoginDto): Promise<{ message: string; token: string }> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordMatch = await compare(password, user.password);

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid login credentials');
    }
    const token = this.generateToken(user._id as any);

    return { message: 'User Login Success', token };
  }

  async getUser(id: string): Promise<User> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Invalid User ID');
    }

    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException('user not found.');
    }

    return user;
  }

  async getUsers(): Promise<User[]> {
    try {
      const users = await this.userModel.find({});
      return users;
    } catch (error) {
      this.logger.error(
        `An error occurred while retrieving users: ${error.message}`,
      );
      throw new Error('An error occurred while retrieving users');
    }
  }

  generateToken(payload: string): string {
    try {
      const token = this.jwtService.sign({ _id: payload });

      return token;
    } catch (error) {
      this.logger.error(
        `An error occurred while generating token: ${error.message}`,
      );
      throw new Error('An error occurred while generating token');
    }
  }
}
