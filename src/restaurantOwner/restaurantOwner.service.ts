import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { CreateRestaurantOwnerDto } from './dto/create_restaurant_owner.dto';
import { UpdateRestaurantOwnerDto } from './dto/update_restaurant_owner.dto';

@Injectable()
export class RestaurantOwnerService {
  constructor(@Inject('KnexConnection') private readonly knex: Knex) {}

  async getRestaurantOwners() {
    return await this.knex.select('*').from('restaurant_owner');
  }

  async getRestaurantOwnerByID(id: string) {
    return await this.knex
      .select('*')
      .from('restaurant_owner')
      .where('restaurant_owner_id', id);
  }

  async createRestaurantOwner(restaurantOwner: CreateRestaurantOwnerDto) {
    return await this.knex
      .insert({
        ...restaurantOwner,
        created_at: new Date(),
        active: true,
      })
      .into('restaurant_owner')
      .returning('*');
  }

  async updateRestaurantOwner(
    id: string,
    restaurantOwner: UpdateRestaurantOwnerDto,
  ) {
    return await this.knex('restaurant_owner')
      .update(restaurantOwner)
      .where('restaurant_owner_id', id)
      .returning('*');
  }

  async deleteRestaurantOwner(id: string) {
    return await this.knex('restaurant_owner')
      .update({ active: false })
      .where('restaurant_owner_id', id)
      .returning('*');
  }
}
