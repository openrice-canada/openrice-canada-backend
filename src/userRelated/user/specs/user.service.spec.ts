import * as dotenv from 'dotenv';
import Knex from 'knex';
import knexConfigs from '../../../../knexfile';
import { UserService } from '../user.service';
import { expectedUsers } from './expectedUsers';

dotenv.config();

const configMode = process.env.TESTING_NODE_ENV || 'testing';
const knexConfig = knexConfigs[configMode];
const knex = Knex(knexConfig);

describe('UserController', () => {
  let userService: UserService;
  let userIDs: { user_id: string }[];

  beforeAll(async () => {
    userService = new UserService(knex);
  });

  beforeEach(async () => {
    userIDs = await knex
      .insert({
        username: expectedUsers[0].username,
        email: expectedUsers[0].email,
        password: expectedUsers[0].password,
        role: expectedUsers[0].role,
        active: expectedUsers[0].active,
        created_at: expectedUsers[0].created_at,
        modified_at: expectedUsers[0].modified_at,
      })
      .into('user')
      .returning('user_id');

    userService = new UserService(knex);
  });

  describe('getUsers', () => {
    it('should return users', async () => {
      const result = await userService.getUsers();
      expect(result).toMatchObject([
        {
          username: expectedUsers[0].username,
          email: expectedUsers[0].email,
          password: expectedUsers[0].password,
          role: expectedUsers[0].role,
        },
      ]);
    });
  });

  describe('getUserByID', () => {
    it('should return user of that user id', async () => {
      const result = await userService.getUserByID(userIDs[0].user_id);
      expect(result).toMatchObject([
        {
          username: expectedUsers[0].username,
          email: expectedUsers[0].email,
          password: expectedUsers[0].password,
          role: expectedUsers[0].role,
        },
      ]);
    });
  });

  describe('createUser', () => {
    it('should return that user after creating a user', async () => {
      const result = await userService.createUser({
        username: expectedUsers[0].username,
        email: expectedUsers[0].email,
        password: expectedUsers[0].password,
        role: expectedUsers[0].role,
      });

      expect(result).toMatchObject([
        {
          username: expectedUsers[0].username,
          email: expectedUsers[0].email,
          password: expectedUsers[0].password,
          role: expectedUsers[0].role,
        },
      ]);
    });
  });

  describe('updateUser', () => {
    it('should return that user after updating a user', async () => {
      const result = await userService.updateUser(userIDs[0].user_id, {
        username: 'ttiimmothy',
      });
      expect(result).toMatchObject([
        {
          username: 'ttiimmothy',
          email: expectedUsers[0].email,
          password: expectedUsers[0].password,
          role: expectedUsers[0].role,
        },
      ]);
    });
  });

  describe('deleteUser', () => {
    it('should return that user after changing the active state of a user', async () => {
      const result = await userService.deleteUser(userIDs[0].user_id);
      expect(result).toMatchObject([
        {
          username: expectedUsers[0].username,
          email: expectedUsers[0].email,
          password: expectedUsers[0].password,
          role: expectedUsers[0].role,
        },
      ]);
    });
  });

  afterEach(async () => {
    await knex('user')
      .whereIn(
        'user_id',
        userIDs.map((userID) => userID.user_id),
      )
      .del();
    await knex('user').where('username', expectedUsers[0].username).del();
  });

  afterAll(async () => {
    await knex.destroy();
  });
});
