import express from 'express';
import {
  addAsset,
  allocateAssetToCentre,
  deallocateAssetFromCentre,
  getAsset,
  modifyAsset,
} from '../controllers/index';
import { handle } from './handler';
import { verify } from './auth';

export const assets = express.Router();

assets.post('/', verify, handle(addAsset));
assets.get('/:id', verify, handle(getAsset));
assets.patch('/:id', verify, handle(modifyAsset));
assets.post('/:id/allocate', verify, handle(allocateAssetToCentre));
assets.delete('/:id/allocate', verify, handle(deallocateAssetFromCentre));
