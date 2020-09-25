import { Repository, makeAddress, makeLocation, makeShoppingCentre } from '../inventory/maker';
import { ErrorMessages, Errors } from '../inventory/errors';

export function makeManageShoppingCentres(repository: Repository) {
  async function createShoppingCentre(
    userID: string,
    name: string,
    lineOne: string,
    city: string,
    state: string,
    postCode: string,
    country: string,
    lineTwo?: string,
  ) {
    const address = makeAddress(lineOne, city, state, postCode, country, lineTwo);
    if (address instanceof Error) {
      throw address;
    }
    const shoppingCentre = makeShoppingCentre(name, address);
    if (shoppingCentre instanceof Error) {
      throw shoppingCentre;
    }

    // check if there is an existing record in DB with all this combination
    const centres = await repository.findCentreMatch(shoppingCentre).catch((err) => {
      throw err;
    });
    const matchingCenterExists = centres.length > 0;
    if (matchingCenterExists) {
      const err = new Error(ErrorMessages.CentreExists); // 'This Shopping Centre already exists'
      err.name = Errors.ConflictError;
      throw err;
    }

    const centreID = await repository.storeCentre(shoppingCentre, userID).catch((err) => {
      throw err;
    });

    shoppingCentre.id = centreID;

    return shoppingCentre;
  }

  async function findShoppingCentre(centreID: string) {
    if (!centreID) {
      const err = new Error(ErrorMessages.ValidCentreID);
      err.name = Errors.InvalidRequestError;
      throw err;
    }

    const centre = await repository.findCentreByID(centreID).catch((err) => {
      throw err;
    });
    if (!centre) {
      const err = new Error(ErrorMessages.NonExistentCentre);
      err.name = Errors.InvalidRequestError;
      throw err;
    }

    return centre;
  }

  async function updateShoppingCentre(
    userID: string,
    centreID: string,
    name: string,
    lineOne: string,
    city: string,
    state: string,
    postCode: string,
    country: string,
    lineTwo?: string,
  ) {
    if (!centreID) {
      const err = new Error(ErrorMessages.ValidCentreID);
      err.name = Errors.InvalidRequestError;
      throw err;
    }
    // check if the ID is correct
    const centre = await repository.findCentreByID(centreID);
    if (!centre) {
      const err = new Error(ErrorMessages.NonExistentCentre);
      err.name = Errors.InvalidRequestError;
      throw err;
    }

    if (!centre.name || !centre.address) {
      const err = new Error(ErrorMessages.UnknownError);
      err.name = Errors.RuntimeError;
      throw err;
    }

    // check which attr is present and patch
    if (name && name !== centre.name) {
      centre.name = name;
    }
    if (lineOne && lineOne !== centre.address.lineOne) {
      centre.address.lineOne = lineOne;
    }
    if (city && city !== centre.address.city) {
      centre.address.city = city;
    }
    if (state && state !== centre.address.state) {
      centre.address.state = state;
    }
    if (country && country !== centre.address.country) {
      centre.address.country = country;
    }
    if (postCode && postCode !== centre.address.postCode) {
      centre.address.postCode = postCode;
    }
    if (lineTwo && lineTwo !== centre.address.lineTwo) {
      centre.address.lineTwo = lineTwo;
    }

    // with the patched object match any conflicts with
    // any 'other' shopping centre
    const centres = await repository.findCentreMatch(centre).catch((err) => {
      throw err;
    });
    centres.forEach((centreRecord) => {
      if (centreRecord.id !== centre.id) {
        const err = new Error(ErrorMessages.CentreExists);
        err.name = Errors.ConflictError;
        throw err;
      }
    });

    const numericID = await repository.updateCentre(centre, userID);
    if (numericID <= 0) {
      const err = new Error(ErrorMessages.UnknownError);
      err.name = Errors.RuntimeError;
      throw err;
    }
    return centre;
  }

  async function removeShoppingCentre(userID: string, centreID: string) {
    // check if the ID is correct
    if (!centreID) {
      const err = new Error(ErrorMessages.ValidCentreID);
      err.name = Errors.InvalidRequestError;
      throw err;
    }
    // check if the ID is correct
    const centre = await repository.findCentreByID(centreID);
    if (!centre) {
      const err = new Error(ErrorMessages.NonExistentCentre);
      err.name = Errors.InvalidRequestError;
      throw err;
    }
    // deactivate the shopping centre
    // deactivate all locations for this shopping centre
    // delete all asset allocations in this shopping centre
    const numericID = await repository.removeCentre(centre.id, userID);
    if (numericID <= 0) {
      const err = new Error(ErrorMessages.UnknownError);
      err.name = Errors.RuntimeError;
      throw err;
    }

    return centre;
  }

  async function createLocation(userID: string, centreID: string, code: string) {
    if (centreID && centreID.trim().length === 0) {
      const err = new Error(ErrorMessages.ValidCentreID); // 'Please enter a valid centreID'
      err.name = Errors.InvalidRequestError;
      throw err;
    }

    if (code && code.trim().length === 0) {
      const err = new Error(ErrorMessages.ValidLocationCode); // 'Please enter a valid location code'
      err.name = Errors.InvalidRequestError;
      throw err;
    }

    // check if there is an existing record in DB with all this combination
    const centre = await repository.findCentreByID(centreID).catch((err) => {
      throw err;
    });

    if (!centre) {
      const err = new Error(ErrorMessages.ValidCentreID); // 'Please enter a valid centreID'
      err.name = Errors.InvalidRequestError;
      throw err;
    }

    const location = makeLocation(code);
    if (location instanceof Error) {
      throw location;
    }

    // check if there is an existing record in DB with all this combination
    const matchingLocation = await repository.findLocationMatch(code, centreID).catch((err) => {
      throw err;
    });

    if (matchingLocation) {
      const err = new Error(ErrorMessages.LocationExists); // 'This Location already exists'
      err.name = Errors.ConflictError;
      throw err;
    }

    const locationID = await repository.storeLocation(location, centreID, userID).catch((err) => {
      throw err;
    });

    location.id = locationID;

    return location;
  }

  async function updateLocation(userID: string, centreID: string, locationID: string, code: string) {
    // check if the ID is correct
    if (locationID && locationID.trim().length === 0) {
      const err = new Error(ErrorMessages.ValidLocationID);
      err.name = Errors.InvalidRequestError;
      throw err;
    }

    const { location, matchingCentreID } = await repository.findLocationByID(locationID).catch((err) => {
      throw err;
    });

    if (!location) {
      const err = new Error(ErrorMessages.ValidLocationID);
      err.name = Errors.InvalidRequestError;
      throw err;
    }

    if (centreID !== matchingCentreID) {
      const err = new Error(ErrorMessages.ValidCentreID);
      err.name = Errors.InvalidRequestError;
      throw err;
    }

    // check if location code is same as existing using ID
    if (code && code === location.code) {
      return location;
    }

    // if not match any conflicts with
    const matchingLocation = await repository.findLocationMatch(code, centreID).catch((err) => {
      throw err;
    });

    // any 'other' locations
    if (matchingLocation && locationID !== matchingLocation.id) {
      const err = new Error(ErrorMessages.LocationExists);
      err.name = Errors.ConflictError;
      throw err;
    }

    location.code = code;

    const numericID = await repository.updateLocation(location, userID);
    if (numericID <= 0) {
      const err = new Error(ErrorMessages.UnknownError);
      err.name = Errors.RuntimeError;
      throw err;
    }

    return location;
  }

  async function removeLocation(userID: string, centreID: string, locationID: string) {
    // check if the ID is correct
    if (locationID && locationID.trim().length === 0) {
      const err = new Error(ErrorMessages.ValidLocationID);
      err.name = Errors.InvalidRequestError;
      throw err;
    }

    const { location, matchingCentreID } = await repository.findLocationByID(locationID).catch((err) => {
      throw err;
    });

    if (!location) {
      const err = new Error(ErrorMessages.ValidLocationID);
      err.name = Errors.InvalidRequestError;
      throw err;
    }

    if (centreID !== matchingCentreID) {
      const err = new Error(ErrorMessages.ValidCentreID);
      err.name = Errors.InvalidRequestError;
      throw err;
    }
    // deactivate the location
    // delete the allocation for this location
    const numericID = await repository.removeLocation(centreID, locationID, userID);
    if (numericID <= 0) {
      const err = new Error(ErrorMessages.UnknownError);
      err.name = Errors.RuntimeError;
      throw err;
    }

    return location;
  }

  return {
    createShoppingCentre,
    findShoppingCentre,
    updateShoppingCentre,
    removeShoppingCentre,
    createLocation,
    updateLocation,
    removeLocation,
  };
}
