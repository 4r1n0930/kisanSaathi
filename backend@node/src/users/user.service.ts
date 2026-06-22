import { IUser } from './user.model';
import { UserRepository } from './user.repository';

export class UserService {
  static async findByEmail(email: string) {
    return UserRepository.findOne({ email });
  }

  static async findByPhone(phone: string) {
    return UserRepository.findOne({ phone });
  }

  static async findAnyDuplicate(payload: Partial<IUser>) {
    const filters: any[] = [];

    if (payload.email) filters.push({ email: payload.email });
    if (payload.phone) filters.push({ phone: payload.phone });
    if (payload.kisanId) filters.push({ kisanId: payload.kisanId });
    if (payload.panNumber) filters.push({ panNumber: payload.panNumber });
    if (payload.licenseNumber) filters.push({ licenseNumber: payload.licenseNumber });
    if (payload.identityNumber) filters.push({ identityNumber: payload.identityNumber });

    if (filters.length === 0) {
      return null;
    }

    return UserRepository.findOne({ $or: filters });
  }

  static async create(payload: Partial<IUser>) {
    return UserRepository.create(payload);
  }

  static sanitize(user: IUser) {
    const object = user.toObject();
    delete object.password;
    return object;
  }
}
