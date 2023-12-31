import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantOwnerController } from '../restaurantOwner.controller';
import { RestaurantOwnerService } from '../restaurantOwner.service';
import { expectedRestaurantOwners } from './expectedRestaurantOwners';

jest.mock('../restaurantOwner.service');

describe('RestaurantOwnerController', () => {
  let restaurantOwner: TestingModule;
  let restaurantOwnerController: RestaurantOwnerController;
  let restaurantOwnerService: RestaurantOwnerService;

  beforeAll(async () => {
    restaurantOwner = await Test.createTestingModule({
      controllers: [RestaurantOwnerController],
      providers: [RestaurantOwnerService],
    }).compile();

    restaurantOwnerController = restaurantOwner.get<RestaurantOwnerController>(
      RestaurantOwnerController,
    );
    restaurantOwnerService = restaurantOwner.get<RestaurantOwnerService>(
      RestaurantOwnerService,
    );
  });

  beforeEach(() => {
    jest
      .spyOn(restaurantOwnerService, 'getRestaurantOwners')
      .mockResolvedValue(expectedRestaurantOwners);
    jest
      .spyOn(restaurantOwnerService, 'getRestaurantOwnerByID')
      .mockResolvedValue(expectedRestaurantOwners);
    jest
      .spyOn(restaurantOwnerService, 'createRestaurantOwner')
      .mockResolvedValue(expectedRestaurantOwners);
    jest
      .spyOn(restaurantOwnerService, 'updateRestaurantOwner')
      .mockResolvedValue(expectedRestaurantOwners);
    jest
      .spyOn(restaurantOwnerService, 'deleteRestaurantOwner')
      .mockResolvedValue(expectedRestaurantOwners);
  });

  describe('getRestaurantOwners', () => {
    it('should return restaurant Owners', async () => {
      const result = await restaurantOwnerController.getRestaurantOwners();
      expect(result).toEqual(expectedRestaurantOwners);
    });
  });

  describe('getRestaurantOwnerByID', () => {
    it('should return restaurant Owner of that restaurant owner id', async () => {
      const result = await restaurantOwnerController.getRestaurantOwnerByID({
        restaurant_owner_id: expectedRestaurantOwners[0].restaurant_owner_id,
      });
      expect(result).toEqual(expectedRestaurantOwners[0]);
    });
  });

  describe('createRestaurantOwner', () => {
    it('should return that restaurant owner after creating a restaurant owner', async () => {
      const result = await restaurantOwnerController.createRestaurantOwner({
        user_id: expectedRestaurantOwners[0].user_id,
        restaurant_id: expectedRestaurantOwners[0].restaurant_id,
      });
      expect(result).toEqual(expectedRestaurantOwners[0]);
    });
  });

  describe('updateRestaurantOwner', () => {
    it('should return that restaurant owner after updating a restaurant owner', async () => {
      const result = await restaurantOwnerController.updateRestaurantOwner(
        {
          restaurant_owner_id: expectedRestaurantOwners[0].restaurant_owner_id,
        },
        {
          user_id: expectedRestaurantOwners[0].user_id,
          restaurant_id: expectedRestaurantOwners[0].restaurant_id,
          active: false,
        },
      );
      expect(result).toEqual(expectedRestaurantOwners[0]);
    });

    it('should return restaurant owner cannot found message if the restaurant owner cannot be found', async () => {
      jest
        .spyOn(restaurantOwnerService, 'getRestaurantOwnerByID')
        .mockResolvedValue(null);

      const result = await restaurantOwnerController.updateRestaurantOwner(
        {
          restaurant_owner_id: expectedRestaurantOwners[0].restaurant_owner_id,
        },
        {
          user_id: expectedRestaurantOwners[0].user_id,
          restaurant_id: expectedRestaurantOwners[0].restaurant_id,
          active: false,
        },
      );

      expect(result).toEqual({
        message: 'This restaurant owner cannot be found',
      });
    });
  });

  describe('deleteRestaurantOwner', () => {
    it('should return that restaurant owner after changing the active state of a restaurant owner', async () => {
      const result = await restaurantOwnerController.deleteRestaurantOwner({
        restaurant_owner_id: expectedRestaurantOwners[0].restaurant_owner_id,
      });
      expect(result).toEqual(expectedRestaurantOwners[0]);
    });

    it('should return restaurant owner cannot be found message if the restaurant owner cannot be found', async () => {
      jest
        .spyOn(restaurantOwnerService, 'getRestaurantOwnerByID')
        .mockResolvedValue(null);
      const result = await restaurantOwnerController.deleteRestaurantOwner({
        restaurant_owner_id: expectedRestaurantOwners[0].restaurant_owner_id,
      });
      expect(result).toEqual({
        message: 'This restaurant owner cannot be found',
      });
    });
  });
});
