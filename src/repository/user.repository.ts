import { IGenericRepository } from '@app/utils/base/repository/base.repository';
import { CreateUserDto } from '@auth/dto/createUser.dto';
import { User } from '@auth/schemas/user.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class UserRepository implements IGenericRepository<User> {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  public async findAll(): Promise<User[]> {
    const users = await this.userModel.find({}).select('-password');
    return users;
  }

  public async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).lean();
    return user;
  }

  public async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select('-password');
    return user;
  }

  public async create(createUserDto: CreateUserDto): Promise<User> {
    const createdDocument = new this.userModel({
      ...createUserDto,
      _id: new Types.ObjectId(),
    });

    return (await createdDocument.save()).toJSON();
  }
}
