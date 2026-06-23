"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const user_model_1 = require("./user.model");
class UserRepository {
    static async findOne(filter) {
        return user_model_1.UserModel.findOne(filter).exec();
    }
    static async create(userData) {
        return user_model_1.UserModel.create(userData);
    }
}
exports.UserRepository = UserRepository;
