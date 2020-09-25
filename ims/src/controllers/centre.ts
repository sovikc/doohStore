import { ErrorCodes } from '../inventory/errors';
import { HttpResponse } from './response';

export function makeAddCentre(addShoppingCentre: any) {
  return async function addCentre(httpRequest: any): Promise<HttpResponse> {
    const { body } = httpRequest;

    if (
      !body.user.id ||
      !body.name ||
      !body.address ||
      !body.address.lineOne ||
      !body.address.city ||
      !body.address.postCode ||
      !body.address.country
    ) {
      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 400,
        body: {
          error: 'A manadatory attribute was missing. Please try again.',
        },
      };
    }

    try {
      const centre = await addShoppingCentre(
        body.user.id,
        body.name,
        body.address.lineOne,
        body.address.city,
        body.address.state,
        body.address.postCode,
        body.address.country,
        body.address.lineTwo,
      );

      const data: any = {};
      data.type = 'ShoppingCentre';
      data.id = centre.id;
      data.attributes = {};
      data.attributes.name = centre.name;
      data.attributes.address = centre.address;
      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 201,
        body: { data },
      };
    } catch (e) {
      console.log(e);
      let msg = e.message;
      let code = ErrorCodes[e.name];
      if (!ErrorCodes[e.name] || ErrorCodes[e.name] === 500) {
        msg = 'An unknown error has occured.';
        code = 500;
      }

      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: code,
        body: {
          error: msg,
        },
      };
    }
  };
}

export function makeFindCentre(findShoppingCentre: any) {
  return async function findCentre(httpRequest: any): Promise<HttpResponse> {
    const { body, params } = httpRequest;

    if (!body.user.id || !params.id) {
      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 400,
        body: {
          error: 'A manadatory parameter was missing. Please try again.',
        },
      };
    }

    try {
      const centre = await findShoppingCentre(params.id);

      const data: any = {};
      data.type = 'ShoppingCentre';
      data.id = centre.id;
      data.attributes = {};
      data.attributes.name = centre.name;
      if (centre.address) {
        data.attributes.address = {};
        data.attributes.address.lineOne = centre.address.lineOne;
        if (centre.address.lineTwo) {
          data.attributes.address.lineTwo = centre.address.lineTwo;
        }
        data.attributes.address.city = centre.address.city;
        data.attributes.address.state = centre.address.state;
        data.attributes.address.postCode = centre.address.postCode;
        data.attributes.address.country = centre.address.country;
      }
      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 201,
        body: { data },
      };
    } catch (e) {
      console.log(e);
      let msg = e.message;
      let code = ErrorCodes[e.name];
      if (!ErrorCodes[e.name] || ErrorCodes[e.name] === 500) {
        msg = 'An unknown error has occured.';
        code = 500;
      }

      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: code,
        body: {
          error: msg,
        },
      };
    }
  };
}

export function makeUpdateCentre(updateShoppingCentre: any) {
  return async function updateCentre(httpRequest: any): Promise<HttpResponse> {
    const { body, params } = httpRequest;
    if (!body.user.id || !params.id) {
      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 400,
        body: {
          error: 'A manadatory parameter was missing. Please try again.',
        },
      };
    }

    if (!body.name && !body.address) {
      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 400,
        body: {
          error: 'Atleast one attribute is required to update. Please try again.',
        },
      };
    }

    const address: any = {};
    if (body.address) {
      address.lineOne = body.address.lineOne;
      address.lineTwo = body.address.lineTwo;
      address.city = body.address.city;
      address.state = body.address.state;
      address.postCode = body.address.postCode;
      address.country = body.address.country;
    }

    try {
      const centre = await updateShoppingCentre(
        body.user.id,
        params.id,
        body.name,
        address.lineOne,
        address.city,
        address.state,
        address.postCode,
        address.country,
        address.lineTwo,
      );

      const data: any = {};
      data.type = 'ShoppingCentre';
      data.id = centre.id;
      data.attributes = {};
      data.attributes.name = centre.name;
      data.attributes.address = centre.address;
      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 200,
        body: { data },
      };
    } catch (e) {
      console.log(e);
      let msg = e.message;
      let code = ErrorCodes[e.name];
      if (!ErrorCodes[e.name] || ErrorCodes[e.name] === 500) {
        msg = 'An unknown error has occured.';
        code = 500;
      }

      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: code,
        body: {
          error: msg,
        },
      };
    }
  };
}

export function makeRemoveCentre(removeShoppingCentre: any) {
  return async function removeCentre(httpRequest: any): Promise<HttpResponse> {
    const { body, params } = httpRequest;
    if (!body.user.id || !params.id) {
      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 400,
        body: {
          error: 'A manadatory parameter was missing. Please try again.',
        },
      };
    }

    try {
      const centre = await removeShoppingCentre(body.user.id, params.id);

      const data: any = {};
      data.message = `The Shopping Centre ${centre.name} with ID ${centre.id} has been deleted`;
      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 200,
        body: { data },
      };
    } catch (e) {
      console.log(e);
      let msg = e.message;
      let code = ErrorCodes[e.name];
      if (!ErrorCodes[e.name] || ErrorCodes[e.name] === 500) {
        msg = 'An unknown error has occured.';
        code = 500;
      }

      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: code,
        body: {
          error: msg,
        },
      };
    }
  };
}

export function makeAddLocation(addCentreLocation: any) {
  return async function addLocation(httpRequest: any): Promise<HttpResponse> {
    const { body, params } = httpRequest;

    if (!body.user.id || !params.id || !body.code) {
      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 400,
        body: {
          error: 'A mandatory attribute or parameter was missing. Please try again.',
        },
      };
    }

    try {
      const location = await addCentreLocation(body.user.id, params.id, body.code);
      const data: any = {};
      data.type = 'Location';
      data.id = location.id;
      data.attributes = {};
      data.attributes.code = location.code;
      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 201,
        body: { data },
      };
    } catch (e) {
      console.log(e);
      let msg = e.message;
      let code = ErrorCodes[e.name];
      if (!ErrorCodes[e.name] || ErrorCodes[e.name] === 500) {
        msg = 'An unknown error has occured.';
        code = 500;
      }

      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: code,
        body: {
          error: msg,
        },
      };
    }
  };
}

export function makeUpdateLocation(updateCentreLocation: any) {
  return async function updateLocation(httpRequest: any): Promise<HttpResponse> {
    const { body, params } = httpRequest;

    if (!body.user.id || !params.id || !params.locationId || !body.code) {
      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 400,
        body: {
          error: 'A mandatory attribute or parameter was missing. Please try again.',
        },
      };
    }

    try {
      const location = await updateCentreLocation(body.user.id, params.id, params.locationId, body.code);
      const data: any = {};
      data.type = 'Location';
      data.id = location.id;
      data.attributes = {};
      data.attributes.code = location.code;
      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 200,
        body: { data },
      };
    } catch (e) {
      console.log(e);
      let msg = e.message;
      let code = ErrorCodes[e.name];
      if (!ErrorCodes[e.name] || ErrorCodes[e.name] === 500) {
        msg = 'An unknown error has occured.';
        code = 500;
      }

      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: code,
        body: {
          error: msg,
        },
      };
    }
  };
}

export function makeRemoveLocation(removeCentreLocation: any) {
  return async function updateLocation(httpRequest: any): Promise<HttpResponse> {
    const { body, params } = httpRequest;

    if (!body.user.id || !params.id || !params.locationId) {
      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 400,
        body: {
          error: 'A mandatory parameter was missing. Please try again.',
        },
      };
    }

    try {
      const location = await removeCentreLocation(body.user.id, params.id, params.locationId);
      const data: any = {};
      data.message = `The Location ${location.code} with ID ${location.id} has been deleted`;
      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 200,
        body: { data },
      };
    } catch (e) {
      console.log(e);
      let msg = e.message;
      let code = ErrorCodes[e.name];
      if (!ErrorCodes[e.name] || ErrorCodes[e.name] === 500) {
        msg = 'An unknown error has occured.';
        code = 500;
      }

      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: code,
        body: {
          error: msg,
        },
      };
    }
  };
}
