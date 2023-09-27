import { Schema, model } from 'mongoose';
import { locationsEnaum, residential, statusEnaum } from './homeInfo.constant';
import { HomeInfoModel, IHomeInfo } from './homeInfo.interface';

// Define the schema for IHomeFeatures
// const HomeFeaturesSchema = new Schema<IHomeFeatures>({
//   hasGarden: { type: Boolean },
//   hasGarage: { type: Boolean },
//   hasInternet: { type: Boolean },
//   hasSecurity: { type: Boolean },
//   hasCleaning: { type: Boolean },
//   hasAirConditioning: { type: Boolean },
// });

// // Define the schema for IHomeSige
// const HomeSizeSchema = new Schema<IHomeSige>({
//   numberOfRooms: { type: Number },
//   numberOfBathrooms: { type: Number },
//   numberOfBalconies: { type: Number },
//   numberOfWindos: { type: Number },
//   numberOfFloors: { type: Number },
//   sizePerUnit: { type: String },
//   totalSQFT: { type: Number },
// });

// // Define the schema for IReview
// const ReviewSchema = new Schema<IReview>({
//   rating: { type: Number, required: true },
//   review: [{ type: String }],
// });

// // Define the schema for IQuestion
// const QuestionSchema = new Schema<IQuestion>({
//   question: { type: String, required: true },
//   answers: [{ type: String }],
// });

// // Define the schema for IHomeDetails
// const HomeDetailsSchema = new Schema<IHomeDetails>({
//   title: { type: String, required: true },
//   tageLine: { type: String, required: true },
//   tages: [{ type: String }],
//   price: { type: Number, required: true },
//   offerPrice: { type: Number },
//   address: { type: String, required: true },
//   description: { type: String, required: true },
//   images: [{ type: String }],
//   homeType: { type: String, required: true },
//   homeSize: { type: Number, required: true },
//   Location: {
//     type: String,
//     enum: [
//       'Demra', 'Dhaka Cantt.', 'Dhamrai', 'Dhanmondi', 'Gulshan', 'Jatrabari',
//       'Joypara', 'Keraniganj', 'Khilgaon', 'Khilkhet', 'Lalbag', 'Mirpur',
//       'Mohammadpur', 'Motijheel', 'Nawabganj', 'New Market', 'Palton', 'Ramna',
//       'Sabujbag', 'Savar', 'Sutrapur', 'Tejgaon', 'Tejgaon Industrial Area', 'Uttara'
//     ],
//     required: true,
//   },
//   homeSizeDetails: { type: HomeSizeSchema },
//   features: { type: HomeFeaturesSchema },
// });

const HomeSchema = new Schema<IHomeInfo, HomeInfoModel>(
  {
    homeOwnerId: { type: String, required: true },
    homeStatus: {
      type: String,
      enum: statusEnaum,
      required: true,
    },
    home: {
      title: { type: String, required: true },
      tageLine: { type: String, required: true },
      tages: [{ type: String }],
      price: { type: Number, required: true },
      offerPrice: { type: Number },
      address: { type: String, required: true },
      description: { type: String, required: true },
      images: [{ type: String }],
      homeType: { type: String, required: true },
      homeSize: { type: Number, required: true },
      residential: {
        type: String,
        enum: residential,
        required: true,
      },
      location: {
        type: String,
        enum: locationsEnaum,
        required: true,
      },
      homeSizeDetails: {
        numberOfRooms: { type: Number },
        numberOfBathrooms: { type: Number },
        numberOfBalconies: { type: Number },
        numberOfWindos: { type: Number },
        numberOfFloors: { type: Number },
        sizePerUnit: { type: String },
        totalSQFT: { type: Number },
      },
      features: {
        hasGarden: { type: Boolean },
        hasGarage: { type: Boolean },
        hasInternet: { type: Boolean },
        hasSecurity: { type: Boolean },
        hasCleaning: { type: Boolean },
        hasAirConditioning: { type: Boolean },
      },
    },
    homeReview: {
      rating: { type: Number, required: true },
      review: [{ type: String }],
    },
    ownerBehaviourCommonQuestion: [],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const HomeInfo = model<IHomeInfo, HomeInfoModel>('HomeInfo', HomeSchema);
