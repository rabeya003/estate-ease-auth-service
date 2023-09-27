import { Schema, model } from 'mongoose';
import { bloodGroup, gender } from './rentUser.constant';
import { IRentUser, RentUserModel } from './rentUser.interface';

export const rentUserSchema = new Schema<IRentUser>(
  {
    id: {
      type: String,
      require: true,
      unique: true,
    },
    name: {
      firstName: {
        type: String,
        require: true,
      },
      middleName: {
        type: String,
      },
      lastName: {
        type: String,
        require: true,
      },
    },
    dateOfBirth: {
      type: String,
    },
    gender: {
      type: String,
      enum: gender,
      require: true,
    },
    bloodGroup: {
      type: String,
      enum: bloodGroup,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    contactNo: {
      type: String,
      unique: true,
      require: true,
    },
    emergencyContactNo: {
      type: String,
      require: true,
    },
    presentAddress: {
      type: String,
      require: true,
    },
    permanentAddress: {
      type: String,
      require: true,
    },
    profileImage: {
      type: String,
      readonly: true,
    },
  },
  {
    timestamps: true,
  }
);

// 3. Create a Model.
export const RentUser = model<IRentUser, RentUserModel>(
  'RentUser',
  rentUserSchema
);
