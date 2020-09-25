import { Repository } from '../inventory/maker';
import { makeManageShoppingCentres } from './centre';
import { makeManageAssets } from './asset';
import { ErrorMessages } from '../inventory/errors';

const mockRepo: Repository = (function Impl(): Repository {
  const centres = new Map();
  const locations = new Map();
  const assets = new Map();
  const allocations = new Map();
  return {
    findCentreByID: function mockFindCentreByID(centreID: string): Promise<any> {
      return new Promise((resolve) => {
        const centre: any = centres.get(centreID);
        resolve(centre);
      });
    },
    findAssetByID: function mockFindAssetByID(assetID: string): Promise<any> {
      return new Promise((resolve) => {
        const asset: any = assets.get(assetID);
        resolve(asset);
      });
    },
    findCentreMatch: function mockFindCentreMatch(centre: any): Promise<any[]> {
      return new Promise((resolve) => {
        const list: any[] = [];
        centres.forEach((val: any) => {
          if (
            centre.name === val.name &&
            centre.address.lineOne === val.address.lineOne &&
            centre.address.city === val.address.city &&
            centre.address.postCode === val.address.postCode &&
            centre.address.country === val.address.country
          ) {
            list.push(val);
          }
        });
        resolve(list);
      });
    },
    findAssetMatch: function mockFindAssetMatch(name: string): Promise<any> {
      return new Promise((resolve) => {
        let asset: any;
        assets.forEach((val: any) => {
          if (val.name === name) {
            asset = val;
          }
        });
        resolve(asset);
      });
    },
    storeCentre: function mockStoreCentre(centre: any, createdBy: string): Promise<string> {
      return new Promise((resolve) => {
        centres.set(centre.id, centre);
        resolve(centre.id);
      });
    },
    updateCentre: function mockUpdateCentre(centre: any, createdBy: string): Promise<number> {
      const numericID: number = 0;
      return new Promise((resolve) => {
        resolve(numericID);
      });
    },
    removeCentre: function mockRemoveCentre(centreID: string, userID: string): Promise<number> {
      let numberID: number = 0;
      return new Promise((resolve) => {
        centres.forEach((val: any) => {
          if (val.id === centreID) {
            locations.forEach((loc: any) => {
              if (loc.centreID === centreID) {
                locations.delete(loc.code);
              }
            });
            centres.delete(val.id);
            numberID += 1;
          }
        });
        resolve(numberID);
      });
    },
    storeLocation: function mockstoreLocation(location: any, centreID: string, createdBy: string): Promise<string> {
      return new Promise((resolve) => {
        // eslint-disable-next-line no-param-reassign
        location.centreID = centreID;
        locations.set(location.code, location);
        resolve(location.id);
      });
    },
    findLocationMatch: function mockFindLocationMatch(code: string, centreID: string): Promise<any> {
      return new Promise((resolve) => {
        let location: any;
        locations.forEach((val: any) => {
          if (val.code === code && val.centreID === centreID) {
            location = val;
          }
        });
        resolve(location);
      });
    },
    findLocationByID: function mockFindLocationByID(locationID: string): Promise<any> {
      return new Promise((resolve) => {
        let location: any;
        let matchingCentreID: any;
        locations.forEach((val: any) => {
          if (val.id === locationID) {
            location = val;
            matchingCentreID = val.centreID;
          }
        });
        resolve({ location, matchingCentreID });
      });
    },
    updateLocation: function mockUpdateLocation(location: any, userID: string): Promise<number> {
      const numberID: number = 0;
      return new Promise((resolve) => {
        resolve(numberID);
      });
    },
    removeLocation: function mockRemoveLocation(centreID: string, locationID: string, userID: string): Promise<number> {
      let numberID: number = 0;
      return new Promise((resolve) => {
        locations.forEach((val: any) => {
          if (val.id === locationID && val.centreID === centreID) {
            locations.delete(val.code);
            numberID += 1;
          }
        });
        resolve(numberID);
      });
    },
    storeAsset: function mockStoreAsset(asset: any, createdBy: string): Promise<string> {
      assets.set(asset.id, asset);
      return new Promise((resolve) => {
        resolve(asset.id);
      });
    },
    findAllocationByLocation: function mockFindAllocationByLocation(
      centreID: string,
      locationID: string,
    ): Promise<any> {
      return new Promise((resolve) => {
        // findAllocationByLocation(centreID, location.id)
        let obj: any;
        const allocation = allocations.get(locationID);
        if (allocation && allocation.centreID === centreID) {
          obj = allocation;
        }
        resolve(obj);
      });
    },
    updateAsset: function mockUpdateAsset(asset: any, createdBy: string): Promise<number> {
      return new Promise((resolve) => {
        const numericID: number = 1;
        resolve(numericID);
      });
    },
    findAssetAllocation: function mockFindAssetAllocation(assetID: string): Promise<any> {
      return new Promise((resolve) => {
        const allocation: any = {};
        resolve(allocation);
      });
    },
    storeAllocation: function mockStoreAllocation(
      centreID: string,
      locationID: any,
      assetID: any,
      userID: string,
    ): Promise<number> {
      return new Promise((resolve) => {
        const allocation = {
          centreID,
          assetID,
          locationID,
          userID,
        };
        allocations.set(locationID, allocation);
        const asset = assets.get(assetID);
        asset.location = locationID;
        const allocationID: number = 0;
        resolve(allocationID);
      });
    },
    removeAllocation: function mockRemoveAllocation(
      centreID: string,
      locationID: any,
      assetID: any,
      userID: string,
    ): Promise<number> {
      return new Promise((resolve) => {
        const allocationID: number = 1;
        allocations.delete(locationID);
        const asset = assets.get(assetID);
        asset.location = undefined;
        resolve(allocationID);
      });
    },
  };
})();

const shoppingCentre: string = 'centre';
describe(shoppingCentre, function centreService() {
  it('must be able to create the shpooing centre factory', () => {
    const { createShoppingCentre, createLocation } = makeManageShoppingCentres(mockRepo);
    expect(createShoppingCentre).toBeDefined();
    expect(createLocation).toBeDefined();
  });
  it('must be able to create a shopping centre', () => {
    const { createShoppingCentre } = makeManageShoppingCentres(mockRepo);
    const centre = createShoppingCentre(
      'someuserid',
      'Goldoler',
      '573 Moore Street',
      'HertfordShire',
      'Top Bristol',
      '500031',
      'Isle of Grand Fenwick',
    );
    expect(centre).toBeDefined();
  });
  it('must not be able to create a duplicate shopping centre', async () => {
    const { createShoppingCentre } = makeManageShoppingCentres(mockRepo);
    await expect(
      createShoppingCentre(
        'someuserid',
        'Goldoler',
        '573 Moore Street',
        'HertfordShire',
        'Top Bristol',
        '500031',
        'Isle of Grand Fenwick',
      ),
    ).rejects.toThrow(ErrorMessages.CentreExists);
  });
  it('must be able to create multiple locations inside shopping centre', async () => {
    const { createLocation } = makeManageShoppingCentres(mockRepo);
    const centres = await mockRepo.findCentreMatch({
      name: 'Goldoler',
      address: {
        lineOne: '573 Moore Street',
        city: 'HertfordShire',
        state: 'Top Bristol',
        postCode: '500031',
        country: 'Isle of Grand Fenwick',
      },
    });
    const locationOne = createLocation('someuserid', centres[0].id, 'L123');
    const locationTwo = createLocation('someuserid', centres[0].id, 'L234');
    expect(locationOne).toBeDefined();
    expect(locationTwo).toBeDefined();
  });
  it('must not be able to create a duplicate location inside shopping centre', async () => {
    const { createLocation } = makeManageShoppingCentres(mockRepo);
    const centres = await mockRepo.findCentreMatch({
      name: 'Goldoler',
      address: {
        lineOne: '573 Moore Street',
        city: 'HertfordShire',
        state: 'Top Bristol',
        postCode: '500031',
        country: 'Isle of Grand Fenwick',
      },
    });
    await expect(createLocation('someuserid', centres[0].id, 'L123')).rejects.toThrow(ErrorMessages.LocationExists);
  });
});

const mediaAsset: string = 'asset';
describe(mediaAsset, function assetService() {
  it('must be able to create the media asset factory', () => {
    const { createAsset } = makeManageAssets(mockRepo);
    expect(createAsset).toBeDefined();
  });
  it('must be able to create multiple assets', async () => {
    const { createAsset } = makeManageAssets(mockRepo);
    const assetOne = await createAsset('someuserid', 'Sign-1', 12.03, 10.5, 2, true);
    const assetTwo = await createAsset('someuserid', 'Sign-2-1500-0709-0314', 15, 7.09, 3.14, true);
    expect(assetOne).toBeDefined();
    expect(assetTwo).toBeDefined();
  });
  it('must not be able to create a duplicate asset with the same name', async () => {
    const { createAsset } = makeManageAssets(mockRepo);
    await expect(createAsset('someuserid', 'Sign-1', 11.03, 12.5, 1.25, true)).rejects.toThrow(
      ErrorMessages.AssetExists,
    );
  });
  it('must be able to patch only an asset name', async () => {
    const { updateAsset } = makeManageAssets(mockRepo);
    const assetRecord = await mockRepo.findAssetMatch('Sign-1');
    const asset = await updateAsset(
      'someuserid',
      assetRecord.id,
      'Sign-1-1203-1005-0200',
      undefined,
      undefined,
      undefined,
      undefined,
    );
    expect(asset.length).toEqual(assetRecord.length);
    expect(asset.breadth).toEqual(assetRecord.breadth);
    expect(asset.depth).toEqual(assetRecord.depth);
    expect(asset.active).toEqual(assetRecord.active);
  });
  it('must allow allocation of an asset', async () => {
    const { allocateAsset } = makeManageAssets(mockRepo);
    const centres = await mockRepo.findCentreMatch({
      name: 'Goldoler',
      address: {
        lineOne: '573 Moore Street',
        city: 'HertfordShire',
        state: 'Top Bristol',
        postCode: '500031',
        country: 'Isle of Grand Fenwick',
      },
    });
    const assetRecord = await mockRepo.findAssetMatch('Sign-1-1203-1005-0200');
    const asset = await allocateAsset('someuserid', assetRecord.id, centres[0].id, 'L123');
    expect(asset).not.toBeInstanceOf(Error);
    expect(asset.location).toEqual('L123');
  });
  it('must not allow an asset to be allocated to a non-vacant location', async () => {
    const { allocateAsset } = makeManageAssets(mockRepo);
    const centres = await mockRepo.findCentreMatch({
      name: 'Goldoler',
      address: {
        lineOne: '573 Moore Street',
        city: 'HertfordShire',
        state: 'Top Bristol',
        postCode: '500031',
        country: 'Isle of Grand Fenwick',
      },
    });
    const assetRecord = await mockRepo.findAssetMatch('Sign-2-1500-0709-0314');
    await expect(allocateAsset('someuserid', assetRecord.id, centres[0].id, 'L123')).rejects.toThrow(
      ErrorMessages.AssetAllocationConflict,
    );
  });
  it('must deallocate an asset once it is no more active', async () => {
    const { allocateAsset, updateAsset } = makeManageAssets(mockRepo);
    const centres = await mockRepo.findCentreMatch({
      name: 'Goldoler',
      address: {
        lineOne: '573 Moore Street',
        city: 'HertfordShire',
        state: 'Top Bristol',
        postCode: '500031',
        country: 'Isle of Grand Fenwick',
      },
    });
    const assetRecord = await mockRepo.findAssetMatch('Sign-2-1500-0709-0314');
    const asset = await allocateAsset('someuserid', assetRecord.id, centres[0].id, 'L234');
    expect(asset.location).toEqual('L234');
    const inactiveAsset = await updateAsset('someuserid', asset.id, undefined, undefined, undefined, undefined, false);
    expect(inactiveAsset.location).toBeUndefined();
  });
  it('must allow deallocation of an asset', async () => {
    const { deallocateAsset } = makeManageAssets(mockRepo);
    const assetRecord = await mockRepo.findAssetMatch('Sign-1-1203-1005-0200');
    await deallocateAsset('someuserid', assetRecord.id);
    const asset = await mockRepo.findAssetByID(assetRecord.id);
    expect(asset.location).toBeUndefined();
  });
  it('must not allow an asset to be allocated to a deactivated location', async () => {
    const { allocateAsset, updateAsset } = makeManageAssets(mockRepo);
    const { removeLocation } = makeManageShoppingCentres(mockRepo);
    const assetRecord = await mockRepo.findAssetMatch('Sign-2-1500-0709-0314');
    const activeAsset = await updateAsset(
      'someuserid',
      assetRecord.id,
      undefined,
      undefined,
      undefined,
      undefined,
      true,
    );
    const centres = await mockRepo.findCentreMatch({
      name: 'Goldoler',
      address: {
        lineOne: '573 Moore Street',
        city: 'HertfordShire',
        state: 'Top Bristol',
        postCode: '500031',
        country: 'Isle of Grand Fenwick',
      },
    });
    const location = await mockRepo.findLocationMatch('L123', centres[0].id);
    const numericID = await removeLocation('someuserid', centres[0].id, location.id);
    await expect(allocateAsset('someuserid', assetRecord.id, centres[0].id, 'L123')).rejects.toThrow(
      ErrorMessages.NonExistentLocationInCentre,
    );
  });
  it('must not allow an asset to be allocated to a deactivated Centre', async () => {
    const { allocateAsset } = makeManageAssets(mockRepo);
    const { removeShoppingCentre } = makeManageShoppingCentres(mockRepo);
    const assetRecord = await mockRepo.findAssetMatch('Sign-2-1500-0709-0314');
    const centres = await mockRepo.findCentreMatch({
      name: 'Goldoler',
      address: {
        lineOne: '573 Moore Street',
        city: 'HertfordShire',
        state: 'Top Bristol',
        postCode: '500031',
        country: 'Isle of Grand Fenwick',
      },
    });
    const numericID = await removeShoppingCentre('someuserid', centres[0].id);
    await expect(allocateAsset('someuserid', assetRecord.id, centres[0].id, 'L123')).rejects.toThrow(
      ErrorMessages.NonExistentCentre,
    );
  });
});
