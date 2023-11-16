import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import * as jwtSimple from 'jwt-simple';
import { UserService } from '../user/user.service';
import { User } from '../user/interfaces/user.interface';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { checkPassword, hashPassword } from '../../global/lib/hash';
import { AuthGuard } from '../../global/guards/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { LoginResponse, RegisterResponse } from './dto/entity/auth.entity';
import { LoginUserDto } from '../user/dto/login-user.dto';

@ApiTags('Auth')
@Controller('api/user/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<RegisterResponse> {
    const users: User[] = await this.userService.getUsers();
    if (users.find((user) => user.username === createUserDto.username)) {
      return { message: 'This username is already used' };
    }

    if (users.find((user) => user.email === createUserDto.email)) {
      return { message: 'This email is already used' };
    }

    const newUser = (
      await this.userService.createUser({
        ...createUserDto,
        password: await hashPassword(createUserDto.password),
      })
    )[0];

    const token = jwtSimple.encode(newUser, process.env.JWT_SECRET as string);
    return { token };
  }

  @Post('login')
  async login(@Body() credentials: LoginUserDto): Promise<LoginResponse> {
    const users: User[] = await this.userService.getUsers();
    console.log(credentials);
    if (
      users.findIndex((user) => user.username === credentials.username) ===
        -1 &&
      users.findIndex((user) => user.email === credentials.username) === -1
    ) {
      return { message: 'The username is not found' };
    }

    const user: User = (await this.authService.login(credentials.username))[0];
    console.log(users);
    const match = await checkPassword(credentials.password, user.password);
    if (match) {
      const token = jwtSimple.encode(user, process.env.JWT_SECRET as string);
      const userFound = {
        user_id: user.user_id,
        email: user.email,
        username: user.username,
        role: user.role,
      };
      return { user: userFound, token };
    } else {
      return { message: 'The password is incorrect' };
    }
  }

  @Get('current-user')
  @UseGuards(AuthGuard)
  getCurrentUser(@Request() req) {
    return { user: req.user };
  }
}
