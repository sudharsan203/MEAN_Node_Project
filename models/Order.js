const { getDB, ObjectId } = require('../config/database');

class Order {
  static getCollection() {
    return getDB().collection('orders');
  }

  static async create(orderData) {
    const order = {
      userId: new ObjectId(orderData.userId),
      items: orderData.items.map(item => ({
        mobileId: new ObjectId(item.mobileId),
        mobile: item.mobile,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal
      })),
      totalAmount: orderData.totalAmount,
      shippingAddress: orderData.shippingAddress,
      status: 'pending', // pending, accepted, delivered, cancelled
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const result = await this.getCollection().insertOne(order);
    return { ...order, _id: result.insertedId };
  }

  static async findById(id) {
    return await this.getCollection().findOne({ _id: new ObjectId(id) });
  }

  static async findByUserId(userId, options = {}) {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const orders = await this.getCollection()
      .find({ userId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await this.getCollection().countDocuments({ userId: new ObjectId(userId) });

    return {
      orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  static async findAll(filter = {}, options = {}) {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const orders = await this.getCollection()
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await this.getCollection().countDocuments(filter);

    return {
      orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  static async updateStatus(id, status) {
    const validStatuses = ['pending', 'accepted', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }

    const result = await this.getCollection().updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status,
          updatedAt: new Date()
        }
      }
    );
    return result;
  }

  static async getOrdersWithUserDetails(filter = {}, options = {}) {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const orders = await this.getCollection().aggregate([
      { $match: filter },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          'user.password': 0
        }
      },
      { $sort: { orderDate: -1 } },
      { $skip: skip },
      { $limit: limit }
    ]).toArray();

    const total = await this.getCollection().countDocuments(filter);

    return {
      orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  static async deleteById(id) {
    return await this.getCollection().deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = Order;
