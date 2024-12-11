import User from '../models/user.js';

export default class UserService {
  static async createUser(name, email) {
    const user = new User({ name, email });
    return await user.save();
  }

  static async getUsuarioByEmail(email) {
    const user = await User.findOne({ email });
    return user
  }
}
