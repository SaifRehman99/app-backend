import { UserRepository } from '@app/repository/user.repository';
import { CreateUserDto } from '@auth/dto/createUser.dto';
import { User } from '@auth/schemas/user.schema';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class UserService {
  // logger below
  private readonly logger;

  // Injecting Model
  constructor(private readonly userRepository: UserRepository) {
    this.logger = new Logger(UserService.name);
  }

  async getUser(id: string): Promise<User> {
    try {
      const isValidId = mongoose.isValidObjectId(id);

      if (!isValidId) {
        throw new BadRequestException('Invalid User ID');
      }

      const user = await this.userRepository.findById(id);

      if (!user) {
        throw new NotFoundException('user not found.');
      }

      return user;
    } catch (error) {
      this.logger.error(
        `An error occurred while retrieving user: ${error.message}`,
      );
      throw new InternalServerErrorException(
        error.message,
        'An error occurred while retrieving user',
      );
    }
  }

  async getUsers(): Promise<User[]> {
    try {
      const users = await this.userRepository.findAll();
      return users;
    } catch (error) {
      this.logger.error(
        `An error occurred while retrieving users: ${error.message}`,
      );
      throw new InternalServerErrorException(
        error.message,
        'An error occurred while retrieving users',
      );
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userRepository.create(createUserDto);
    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    return user;
  }
}
