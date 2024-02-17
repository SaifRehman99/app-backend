import { AuthGuard } from '@auth/auth.guard';
import { User } from '@auth/schemas/user.schema';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @desc      Get All Users
  // @route     GET /api/v1/users
  // @access    Private
  @Get('all')
  async getUsers(): Promise<User[]> {
    const response = await this.userService.getUsers();
    return response;
  }

  // @desc      Get Single User
  // @route     GET /api/v1/user/:userId
  // @access    Private

  @Get(':id')
  async getUser(
    @Param('id')
    id: string,
  ): Promise<User> {
    const response = await this.userService.getUser(id);
    return response;
  }
}
