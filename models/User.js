const { getDB, ObjectId } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static getCollection() {
    return getDB().collection('users');
  }

  static async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  static async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  static async create(userData) {
    const hashedPassword = await this.hashPassword(userData.password);
    
    const user = {
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: userData.role || 'customer', // 'customer' or 'admin'
      phone: userData.phone,
      address: userData.address,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const result = await this.getCollection().insertOne(user);
    console.log("Insert Result =>", result)
    return { ...user, _id: result.insertedId };
  }

  static async findByEmail(email) {
    return await this.getCollection().findOne({ email });
  }

  static async findById(id) {
    return await this.getCollection().findOne({ _id: new ObjectId(id) });
  }

  static async updateById(id, updateData) {
    updateData.updatedAt = new Date();
    const result = await this.getCollection().updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    return result;
  }

  static async findAll(filter = {}) {
    return await this.getCollection().find(filter).toArray();
  }

  static async deleteById(id) {
    return await this.getCollection().deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = User;
