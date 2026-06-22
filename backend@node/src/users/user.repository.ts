import { FilterQuery } from 'mongoose';
import { IUser, UserModel } from './user.model';

export class UserRepository {
  static async findOne(filter: FilterQuery<IUser>) {
    return UserModel.findOne(filter).exec();
  }

  static async create(userData: Partial<IUser>) {
    return UserModel.create(userData);
  }
}
