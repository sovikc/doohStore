import { makeManageShoppingCentres } from './centre';
import { makeManageAssets } from './asset';
import { repository } from '../postgres/index';

export const {
  createShoppingCentre,
  findShoppingCentre,
  updateShoppingCentre,
  removeShoppingCentre,
  createLocation,
  updateLocation,
  removeLocation,
} = makeManageShoppingCentres(repository);

export const { createAsset, findAsset, updateAsset, allocateAsset, deallocateAsset } = makeManageAssets(repository);

// export default createShoppingCentre;
