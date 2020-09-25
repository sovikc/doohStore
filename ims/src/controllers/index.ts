import {
  makeAddCentre,
  makeAddLocation,
  makeFindCentre,
  makeRemoveCentre,
  makeRemoveLocation,
  makeUpdateCentre,
  makeUpdateLocation,
} from './centre';
import { makeAddAsset, makeAllocateAsset, makeDeallocateAsset, makeFindAsset, makeUpdateAsset } from './asset';
import {
  allocateAsset,
  createAsset,
  createLocation,
  createShoppingCentre,
  deallocateAsset,
  findAsset,
  findShoppingCentre,
  removeLocation,
  removeShoppingCentre,
  updateAsset,
  updateLocation,
  updateShoppingCentre,
} from '../management/index';

const addCentre = makeAddCentre(createShoppingCentre);
const findCentre = makeFindCentre(findShoppingCentre);
const updateCentre = makeUpdateCentre(updateShoppingCentre);
const removeCentre = makeRemoveCentre(removeShoppingCentre);

const addLocationInCentre = makeAddLocation(createLocation);
const modifyLocationInCentre = makeUpdateLocation(updateLocation);
const removeLocationInCentre = makeRemoveLocation(removeLocation);

const addAsset = makeAddAsset(createAsset);
const getAsset = makeFindAsset(findAsset);
const modifyAsset = makeUpdateAsset(updateAsset);
const allocateAssetToCentre = makeAllocateAsset(allocateAsset);
const deallocateAssetFromCentre = makeDeallocateAsset(deallocateAsset);

export {
  addCentre,
  findCentre,
  updateCentre,
  removeCentre,
  addLocationInCentre,
  modifyLocationInCentre,
  removeLocationInCentre,
  addAsset,
  getAsset,
  modifyAsset,
  allocateAssetToCentre,
  deallocateAssetFromCentre,
};
