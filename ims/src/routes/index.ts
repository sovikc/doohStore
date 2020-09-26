import express, { Request, Response } from 'express';

export const router = express.Router();

const apis = `Welcome, following are the APIs available from this server.
---------------------------------------------------------------------------
---------------------------------------------------------------------------

POST         /centres

--------------------------------

GET          /centres/:id

--------------------------------

PATCH        /centres/:id

--------------------------------

DELETE       /centres/:id

--------------------------------

POST         /centres/:id/locations

--------------------------------

PATCH        /centres/:id/locations/:locationId

--------------------------------

DELETE       /centres/:id/locations/:locationId

--------------------------------

POST         /assets

--------------------------------

PATCH        /assets/:id

--------------------------------

POST         /assets/:id/allocate

--------------------------------

DELETE       /assets/:id/allocate

--------------------------------
`;

router.get('/', function index(req: Request, res: Response) {
  res.send(apis);
});
