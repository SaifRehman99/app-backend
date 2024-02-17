import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '@auth/schemas/user.schema';
import { AuthModule } from '@auth/auth.module';
import { RepositoryModule } from '@app/repository/repository.module';

@Module({
  imports: [
    // Mongoose register below
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    AuthModule,
    RepositoryModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
