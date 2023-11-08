import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@Injectable()
export class RestaurantService {
  constructor(@Inject('KnexConnection') private readonly knex: Knex) {}

  async getRestaurants() {
    return await this.knex.select('*').from('restaurant');
  }

  async getRestaurantByID(id: string) {
    return await this.knex.select('*').from('restaurant').where('id', id)[0];
  }

  async createRestaurant(restaurant: CreateRestaurantDto) {
    return await this.knex
      .insert({
        ...restaurant,
        created_at: new Date(),
        modified_at: new Date(),
        active: true,
      })
      .into('restaurant')
      .returning('*');
  }

  async updateRestaurant(id: string, restaurant: UpdateRestaurantDto) {
    return await this.knex('restaurant')
      .update({ ...restaurant, modified_at: new Date() })
      .where('id', id)
      .returning('*');
  }

  async deleteRestaurant(id: string) {
    return await this.knex('restaurant')
      .update({ active: false, modified_at: new Date() })
      .where('id', id)
      .returning('*');
  }

  async getAverageRating(id: string) {
    const totalRating = (
      await this.knex('review').sum('rating').where('restaurant_id', id)
    )[0].sum;
    const ratingCount = (
      await this.knex('review').count('rating').where('restaurant_id', id)
    )[0].count;
    return parseInt(totalRating) / parseInt(ratingCount as string);
  }

  async getReviewCount(id: string) {
    return (
      await this.knex('review').count('rating').where('restaurant_id', id)
    )[0].count;
  }
}