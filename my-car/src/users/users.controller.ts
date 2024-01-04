import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  NotFoundException,
  Session,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/createUser.dto';
import { UsersService } from '../users/users.service';
import { UserDto } from './dtos/user.dto';
import { Serialize } from '../interceptor/serialize.interceptor';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/currentUser.decorator';
import { User } from './user.entity';
import { Authguard } from '../guards/auth.guard';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  // 测试 session 能否存储
  // @Get('who')
  // who(@Session() session: any) {
  //   if (!session.userId) {
  //     return null;
  //   }
  //   return this.usersService.findOne(session.userId);
  // }
  @UseGuards(Authguard)
  @Get('who')
  who(@CurrentUser() user: User) {
    return user;
  }

  @Post('signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('signin')
  async siginUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.sigin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('signout')
  signOut(@Session() session: any) {
    session.userId = null;
    return 'sign out!!';
  }

  @Get()
  findUsers() {
    return this.usersService.find();
  }

  @Get(':id')
  findUserById(@Param('id') id: number) {
    const user = this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  @Put(':id')
  updateUser(@Param('id') id: number, @Body() body: Partial<CreateUserDto>) {
    return this.usersService.update(id, body);
  }

  @Delete(':id')
  removeUser(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
