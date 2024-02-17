import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AuthController } from '@auth/auth.controller';
import { AuthService } from '@auth/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '@auth/schemas/user.schema';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RepositoryModule } from '@app/repository/repository.module';
import { UserModule } from '@app/user/user.module';

@Module({
  imports: [
    // adding JWT config
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRE'),
          },
        };
      },
    }),

    // Mongoose register below
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    RepositoryModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
