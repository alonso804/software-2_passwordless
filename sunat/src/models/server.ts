import { getModelForClass, index, prop, type ReturnModelType } from '@typegoose/typegoose';
import bcrypt from 'bcryptjs';
import type { Document } from 'mongoose';
import NoPublcKey from 'src/errors/no-public-key';
import NotFound from 'src/errors/not-found';

@index({ name: 1 }, { unique: true })
export class Server {
  @prop()
  name: string;

  @prop()
  password: string;

  @prop({ required: false })
  publicKey?: string;

  static async findByName(
    this: ReturnModelType<typeof Server>,
    name: string,
  ): Promise<ServerDocument | null> {
    return this.findOne({ name });
  }

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  static async comparePassword(data: { input: string; hash: string }): Promise<boolean> {
    return bcrypt.compare(data.input, data.hash);
  }

  static async updatePublicKey(
    this: ReturnModelType<typeof Server>,
    data: { _id: string; publicKey: string },
  ): Promise<void> {
    await this.findByIdAndUpdate(data._id, { publicKey: data.publicKey });
  }

  static async getPublicKey(this: ReturnModelType<typeof Server>, _id: string): Promise<string> {
    const server = await this.findById(_id, { publicKey: 1 }).lean();

    if (!server) throw new NotFound('server', _id);

    if (!server.publicKey) throw new NoPublcKey(_id);

    return server.publicKey;
  }
}

export type ServerDocument = Server & Document;

const ServerModel = getModelForClass(Server);

export default ServerModel;
