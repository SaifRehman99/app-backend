import { Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserSchema } from '@auth/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    // Mongoose register below
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  providers: [UserRepository],
  exports: [UserRepository],
})
export class RepositoryModule {}
