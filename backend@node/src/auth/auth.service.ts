import bcrypt from 'bcrypt';
import { signJwtToken } from './jwt.strategy';
import { UserService } from '../users/user.service';
import { FarmerService } from '../farmer/farmer.service';
import { TraderService } from '../trader/trader.service';
import { InspectorService } from '../inspector/inspector.service';

const VALID_ROLES = ['FARMER', 'TRADER', 'INSPECTOR'] as const;

type RoleType = typeof VALID_ROLES[number];

export class AuthService {
  static async register(payload: any) {
    const role = String(payload?.role || '').toUpperCase() as RoleType;

    if (!VALID_ROLES.includes(role)) {
      throw { statusCode: 400, message: 'Invalid or missing role for registration' };
    }

    let userPayload: any;

    if (role === 'FARMER') {
      userPayload = FarmerService.buildRegistrationPayload(payload);
    } else if (role === 'TRADER') {
      userPayload = TraderService.buildRegistrationPayload(payload);
    } else {
      userPayload = InspectorService.buildRegistrationPayload(payload);
    }

    await AuthService.validateDuplicateUser(userPayload);

    const hashedPassword = await bcrypt.hash(userPayload.password, 10);
    const user = await UserService.create({ ...userPayload, password: hashedPassword });
    const token = signJwtToken({ id: user._id.toString(), email: user.email, role: user.role });

    return {
      token,
      user: UserService.sanitize(user),
      role: user.role,
    };
  }

  static async login(email: string, password: string) {
    if (!email || !password) {
      throw { statusCode: 400, message: 'Email and password are required' };
    }

    const existingUser = await UserService.findByEmail(email);
    if (!existingUser) {
      throw { statusCode: 401, message: 'Invalid email or password' };
    }

    const passwordMatched = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatched) {
      throw { statusCode: 401, message: 'Invalid email or password' };
    }

    const token = signJwtToken({ id: existingUser._id.toString(), email: existingUser.email, role: existingUser.role });

    return {
      token,
      user: UserService.sanitize(existingUser),
      role: existingUser.role,
    };
  }

  private static async validateDuplicateUser(payload: any) {
    const duplicate = await UserService.findAnyDuplicate({
      email: payload.email,
      phone: payload.phone,
      kisanId: payload.kisanId,
      panNumber: payload.panNumber,
      licenseNumber: payload.licenseNumber,
      identityNumber: payload.identityNumber,
    });

    if (duplicate) {
      throw { statusCode: 409, message: 'Duplicate email, phone or identity document detected' };
    }
  }
}
