const { getDB, ObjectId } = require('../config/database');

class Cart {
  static getCollection() {
    return getDB().collection('carts');
  }

  static async findByUserId(userId) {
    return await this.getCollection().findOne({ userId: new ObjectId(userId) });
  }

  static async addItem(userId, mobileId, quantity = 1) {
    const cart = await this.findByUserId(userId);
    
    if (cart) {
      // Check if mobile already exists in cart
      const existingItem = cart.items.find(item => item.mobileId.toString() === mobileId);
      
      if (existingItem) {
        // Update quantity
        const result = await this.getCollection().updateOne(
          { userId: new ObjectId(userId), 'items.mobileId': new ObjectId(mobileId) },
          { 
            $inc: { 'items.$.quantity': quantity },
            $set: { updatedAt: new Date() }
          }
        );
        return result;
      } else {
        // Add new item
        const result = await this.getCollection().updateOne(
          { userId: new ObjectId(userId) },
          { 
            $push: { 
              items: { 
                mobileId: new ObjectId(mobileId), 
                quantity 
              } 
            },
            $set: { updatedAt: new Date() }
          }
        );
        return result;
      }
    } else {
      // Create new cart
      const newCart = {
        userId: new ObjectId(userId),
        items: [
          { mobileId: new ObjectId(mobileId), quantity }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const result = await this.getCollection().insertOne(newCart);
      return result;
    }
  }

  static async removeItem(userId, mobileId) {
    return await this.getCollection().updateOne(
      { userId: new ObjectId(userId) },
      { 
        $pull: { items: { mobileId: new ObjectId(mobileId) } },
        $set: { updatedAt: new Date() }
      }
    );
  }

  static async updateItemQuantity(userId, mobileId, quantity) {
    return await this.getCollection().updateOne(
      { userId: new ObjectId(userId), 'items.mobileId': new ObjectId(mobileId) },
      { 
        $set: { 
          'items.$.quantity': quantity,
          updatedAt: new Date()
        }
      }
    );
  }

  static async clearCart(userId) {
    return await this.getCollection().deleteOne({ userId: new ObjectId(userId) });
  }

  static async getCartWithDetails(userId) {
    const result = await this.getCollection().aggregate([
      { $match: { userId: new ObjectId(userId) } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'mobiles',
          localField: 'items.mobileId',
          foreignField: '_id',
          as: 'mobileDetails'
        }
      },
      { $unwind: '$mobileDetails' },
      {
        $group: {
          _id: '$_id',
          userId: { $first: '$userId' },
          items: {
            $push: {
              mobile: '$mobileDetails',
              quantity: '$items.quantity',
              subtotal: { $multiply: [{ $toDouble: '$mobileDetails.price' }, '$items.quantity'] }
            }
          },
          createdAt: { $first: '$createdAt' },
          updatedAt: { $first: '$updatedAt' }
        }
      },
      {
        $addFields: {
          total: { $sum: '$items.subtotal' }
        }
      }
    ]).toArray();

    return result[0] || null;
  }
}

module.exports = Cart;
