import UserService from '../services/userServices.js';

export default class UserController {
  static async createUser(req, res) {
    const { name, email } = req.body;
    try {
      const user = await UserService.createUser(name, email);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: 'Error creating user', error });
    }
  }
}
