import mongoose, { Schema, Document } from 'mongoose';

export interface IPosition extends Document {
  userId: mongoose.Types.ObjectId;
  symbol: string;
  assetType: 'stock' | 'crypto' | 'forex' | 'commodity';
  quantity: number;
  averagePrice: number;
  currentPrice?: number;
  marketValue?: number;
  unrealizedPnL?: number;
  unrealizedPnLPercent?: number;
  totalCost: number;
  side: 'long' | 'short';
  openedAt: Date;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

const positionSchema = new Schema<IPosition>(
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
      enum: ['stock', 'crypto', 'forex', 'commodity'],
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    averagePrice: {
      type: Number,
      required: true,
      min: 0
    },
    currentPrice: {
      type: Number,
      min: 0
    },
    marketValue: {
      type: Number
    },
    unrealizedPnL: {
      type: Number
    },
    unrealizedPnLPercent: {
      type: Number
    },
    totalCost: {
      type: Number,
      required: true
    },
    side: {
      type: String,
      enum: ['long', 'short'],
      default: 'long'
    },
    openedAt: {
      type: Date,
      default: Date.now
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Compound index for unique positions per user
positionSchema.index({ userId: 1, symbol: 1 }, { unique: true });
positionSchema.index({ userId: 1, assetType: 1 });

// Method to update position with current market price
positionSchema.methods.updateWithCurrentPrice = function(currentPrice: number) {
  this.currentPrice = currentPrice;
  this.marketValue = this.quantity * currentPrice;
  this.unrealizedPnL = this.marketValue - this.totalCost;
  this.unrealizedPnLPercent = (this.unrealizedPnL / this.totalCost) * 100;
  this.lastUpdated = new Date();
};

const Position = mongoose.model<IPosition>('Position', positionSchema);

export default Position;
