import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { KnexModule } from 'src/global/modules/knex.module';

@Module({
  imports: [KnexModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}