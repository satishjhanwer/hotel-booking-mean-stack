import mongoose, { Document, Schema } from "mongoose";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";

interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  generatePasswordResetToken(): string;
  generateHash(password: string): string;
  validatePassword(password: string): boolean;
  updateProfile(firstName?: string, lastName?: string): Promise<void>;
  generateJWT(): string;
}

const userSchema: Schema<IUser> = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
});

userSchema.methods.generatePasswordResetToken = function (): string {
  const token = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = token;
  this.resetPasswordExpires = new Date(Date.now() + 3600000);
  return token;
};

userSchema.methods.generateHash = function (password: string): string {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

userSchema.methods.validatePassword = function (password: string): boolean {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.updateProfile = async function (firstName?: string, lastName?: string): Promise<void> {
  this.firstName = firstName ?? this.firstName;
  this.lastName = lastName ?? this.lastName;
  await this.save();
};

userSchema.methods.generateJWT = function (): string {
  const today = new Date();
  const exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jsonwebtoken.sign(
    {
      id: this._id,
      email: this.email,
      isAdmin: this.isAdmin,
      exp: Math.floor(exp.getTime() / 1000),
    },
    process.env.JWT_SECRET || "your_jwt_secret"
  );
};

const User = mongoose.model<IUser>("User", userSchema);
export default User;
