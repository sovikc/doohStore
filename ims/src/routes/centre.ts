import express from 'express';
import {
  addCentre,
  addLocationInCentre,
  findCentre,
  modifyLocationInCentre,
  removeCentre,
  removeLocationInCentre,
  updateCentre,
} from '../controllers/index';
import { handle } from './handler';
import { verify } from './auth';

export const centres = express.Router();

centres.post('/', verify, handle(addCentre));
centres.get('/:id', verify, handle(findCentre));
centres.patch('/:id', verify, handle(updateCentre));
centres.delete('/:id', verify, handle(removeCentre));
centres.post('/:id/locations', verify, handle(addLocationInCentre));
centres.patch('/:id/locations/:locationId', verify, handle(modifyLocationInCentre));
centres.delete('/:id/locations/:locationId', verify, handle(removeLocationInCentre));
