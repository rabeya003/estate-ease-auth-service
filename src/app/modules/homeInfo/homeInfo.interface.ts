import { Model } from 'mongoose';

export type IHomeFeatures = {
  hasGarden?: boolean;
  hasGarage?: boolean;
  hasInternet?: boolean;
  hasSecurity?: boolean;
  hasCleaning?: boolean;
  hasAirConditioning?: boolean;
};

export type IHomeSige = {
  numberOfRooms?: number;
  numberOfBathrooms?: number;
  numberOfBalconies?: number;
  numberOfWindos?: number;
  numberOfFloors?: number;
  sizePerUnit?: string;
  totalSQFT?: number;
};

export type IHomeDetails = {
  title: string;
  tageLine: string;
  tages?: string[];
  price: number;
  offerPrice?: number;
  address: string;
  description: string;
  images: string[];
  homeSize: number;
  homeType: string;
  residential:
    | 'Apartment'
    | 'House'
    | 'Duplex'
    | 'Condo'
    | 'Townhouse'
    | 'Villa'
    | 'Penthouse'
    | 'Studio';
  location:
    | 'Demra'
    | 'Dhaka Cantt.'
    | 'Dhamrai'
    | 'Dhanmondi'
    | 'Gulshan'
    | 'Jatrabari'
    | 'Joypara'
    | 'Keraniganj'
    | 'Khilgaon'
    | 'Khilkhet'
    | 'Lalbag'
    | 'Mirpur'
    | 'Mohammadpur'
    | 'Motijheel'
    | 'Nawabganj'
    | 'New Market'
    | 'Palton'
    | 'Ramna'
    | 'Sabujbag'
    | 'Savar'
    | 'Sutrapur'
    | 'Tejgaon'
    | 'Tejgaon Industrial Area'
    | 'Uttara';
  homeSizeDetails: IHomeSige;
  features: IHomeFeatures;
};

export type IReview = {
  rating: number;
  review: string[];
};

export type IQuestion = {
  question: string;
  answers: string[];
};

export type IHomeInfo = {
  homeOwnerId: string;
  homeStatus:
    | 'available'
    | 'rentedOut'
    | 'rentedOutApproval'
    | 'pending'
    | 'unavailableApproval';
  home: IHomeDetails;
  homeReview: IReview;
  ownerBehaviourCommonQuestion: IQuestion[];
};

export type HomeInfoModel = Model<IHomeInfo, Record<string, unknown>>;

export type IHomeFilters = {
  searchTerm?: string;
  location?: string;
  residential?: string;
  price?: number;
  homeSize?: number;
};
