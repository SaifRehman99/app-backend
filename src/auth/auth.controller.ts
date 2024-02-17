import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthService } from '@auth/auth.service';
import { CreateUserDto } from '@auth/dto/createUser.dto';
import { LoginDto } from '@auth/dto/login.dto';
import { UserType } from '@auth/types/auth.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly userAuthService: AuthService) {}

  // @desc      User Registration
  // @route     GET /api/v1/auth/signup
  // @access    Public
  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async signUp(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ message: string; token: string; user: any }> {
    const response = await this.userAuthService.signUp(createUserDto);
    return response;
  }

  // @desc      User Login
  // @route     GET /api/v1/auth/login
  // @access    Public
  @Post('login')
  async login(
    @Body() userDto: LoginDto,
  ): Promise<{ message: string; token: string }> {
    const response = await this.userAuthService.login(userDto);
    return response;
  }
}
