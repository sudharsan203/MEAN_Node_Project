const { getDB, ObjectId } = require('../config/database');

class Mobile {
  static getCollection() {
    return getDB().collection('mobiles');
  }

  static async create(mobileData) {
    const mobile = {
      brand: mobileData.brand,
      model: mobileData.model,
      price: Number(mobileData.price) || 0,
      specifications: {
        ram: mobileData.specifications?.ram,
        storage: mobileData.specifications?.storage,
        camera: mobileData.specifications?.camera,
        battery: mobileData.specifications?.battery,
        display: mobileData.specifications?.display,
        processor: mobileData.specifications?.processor
      },
      stock: Number(mobileData.stock) || 0,
      imageUrl: mobileData.imageUrl,
      description: mobileData.description,
      isAvailable: mobileData.isAvailable !== false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const result = await this.getCollection().insertOne(mobile);
    return { ...mobile, _id: result.insertedId };
  }

  static async findAll(filter = {}, options = {}) {
    const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
    const skip = (page - 1) * limit;

    const query = { ...filter };
    
    const mobiles = await this.getCollection()
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await this.getCollection().countDocuments(query);

    return {
      mobiles,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  static async findById(id) {
    return await this.getCollection().findOne({ _id: new ObjectId(id) });
  }

  static async updateById(id, updateData) {
    // Convert price and stock to numbers if they exist
    if (updateData.price !== undefined) {
      updateData.price = Number(updateData.price);
    }
    if (updateData.stock !== undefined) {
      updateData.stock = Number(updateData.stock);
    }
    updateData.updatedAt = new Date();
    const result = await this.getCollection().updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    return result;
  }

  static async deleteById(id) {
    return await this.getCollection().deleteOne({ _id: new ObjectId(id) });
  }

  static async updateStock(id, quantity) {
    const result = await this.getCollection().updateOne(
      { _id: new ObjectId(id) },
      { 
        $inc: { stock: Number(quantity) },
        $set: { updatedAt: new Date() }
      }
    );
    return result;
  }

  static async search(searchTerm) {
    return await this.getCollection().find({
      $or: [
        { brand: { $regex: searchTerm, $options: 'i' } },
        { model: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } }
      ]
    }).toArray();
  }
}

module.exports = Mobile;
