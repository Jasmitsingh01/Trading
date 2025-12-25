import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  symbol: string;
  assetType: 'stock' | 'crypto' | 'forex' | 'commodity';
  orderType: 'market' | 'limit' | 'stop' | 'stop_limit';
  side: 'buy' | 'sell';
  quantity: number;
  price?: number;
  stopPrice?: number;
  status: 'pending' | 'working' | 'filled' | 'partially_filled' | 'cancelled' | 'rejected';
  filledQuantity: number;
  averageFillPrice?: number;
  timeInForce: 'day' | 'gtc' | 'ioc' | 'fok'; // Good Till Cancel, Immediate or Cancel, Fill or Kill
  expiresAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      index: true
    },
    assetType: {
      type: String,
      enum: ['stock', 'cryptocurrency', 'forex', 'commodity'],
      required: true
    },
    orderType: {
      type: String,
      enum: ['market', 'limit', 'stop', 'stop_limit'],
      required: true
    },
    side: {
      type: String,
      enum: ['buy', 'sell'],
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    price: {
      type: Number,
      min: 0
    },
    stopPrice: {
      type: Number,
      min: 0
    },
    status: {
      type: String,
      enum: ['pending', 'working', 'filled', 'partially_filled', 'cancelled', 'rejected'],
      default: 'pending',
      index: true
    },
    filledQuantity: {
      type: Number,
      default: 0,
      min: 0
    },
    averageFillPrice: {
      type: Number,
      min: 0
    },
    timeInForce: {
      type: String,
      enum: ['day', 'gtc', 'ioc', 'fok'],
      default: 'day'
    },
    expiresAt: {
      type: Date
    },
    notes: {
      type: String,
      maxlength: 500
    }
  },
  {
    timestamps: true
  }
);

// Indexes for efficient queries
orderSchema.index({ userId: 1, status: 1 });
orderSchema.index({ userId: 1, symbol: 1 });
orderSchema.index({ createdAt: -1 });

export const Order = mongoose.model<IOrder>('Order', orderSchema);

export default Order;
