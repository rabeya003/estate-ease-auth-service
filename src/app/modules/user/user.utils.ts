import { User } from './user.model';

export const findLastRentUserId = async (): Promise<string | undefined> => {
  const lastlastRentUser = await User.findOne(
    { role: 'RentUser' },
    { id: 1, _id: 0 }
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastlastRentUser?.id ? lastlastRentUser.id.substring(3) : undefined;
};

export const generateRentUserId = async (): Promise<string> => {
  const currentId =
    (await findLastRentUserId()) || (0).toString().padStart(5, '0');
  let incrementedId = (parseInt(currentId) + 1).toString().padStart(5, '0');
  incrementedId = `RU-${incrementedId}`;
  console.log(incrementedId);
  return incrementedId;
};

export const findLastHomeOwnerId = async (): Promise<string | undefined> => {
  const lastHomeOwner = await User.findOne(
    { role: 'HomeOwner' },
    { id: 1, _id: 0 }
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastHomeOwner?.id ? lastHomeOwner.id.substring(3) : undefined;
};

export const generateHomeOwnerId = async (): Promise<string> => {
  const currentId =
    (await findLastHomeOwnerId()) || (0).toString().padStart(5, '0');
  let incrementedId = (parseInt(currentId) + 1).toString().padStart(5, '0');
  incrementedId = `HW-${incrementedId}`;

  return incrementedId;
};
export const findLastAdminId = async (): Promise<string | undefined> => {
  const lastAdmin = await User.findOne({ role: 'Admin' }, { id: 1, _id: 0 })
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastAdmin?.id ? lastAdmin.id.substring(3) : undefined;
};
export const generateAdminId = async (): Promise<string> => {
  const currentId =
    (await findLastAdminId()) || (0).toString().padStart(5, '0');
  let incrementedId = (parseInt(currentId) + 1).toString().padStart(5, '0');
  incrementedId = `AD-${incrementedId}`;

  return incrementedId;
};
