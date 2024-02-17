import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Param,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { User } from '@auth/schemas/user.schema';
import { AuthGuard } from '@auth/auth.guard';
import { AuthService } from '@auth/auth.service';
import { CreateUserDto } from '@auth/dto/createUser.dto';
import { LoginDto } from '@auth/dto/login.dto';
import { UserType } from '@auth/types/auth.types';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly userAuthService: AuthService) {}

  // @desc      User Registration
  // @route     GET /api/v1/auth/signup
  // @access    Public
  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async signUp(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ message: string; token: string; user: UserType }> {
    return await this.userAuthService.signUp(createUserDto);
  }

  // @desc      User Login
  // @route     GET /api/v1/auth/login
  // @access    Public
  @Post('login')
  async login(
    @Body() userDto: LoginDto,
  ): Promise<{ message: string; token: string }> {
    return await this.userAuthService.login(userDto);
  }

  // @desc      Get Single User
  // @route     GET /api/v1/auth/user/:userId
  // @access    Private

  @UseGuards(AuthGuard)
  @Get('user/:id')
  async getUser(
    @Param('id')
    id: string,
  ): Promise<User> {
    return await this.userAuthService.getUser(id);
  }

  // @desc      Get All Users
  // @route     GET /api/v1/auth/users
  // @access    Private
  @Get('users')
  @UseGuards(AuthGuard)
  async getUsers(): Promise<User[]> {
    return await this.userAuthService.getUsers();
  }
}
