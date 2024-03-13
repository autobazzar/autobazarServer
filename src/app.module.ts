import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    TypeOrmModule.forRoot(
      {
        type: 'sqlite',
        database: 'db/sql',
        synchronize: true,
        entities: [User],
        logging: true,
        logger: 'file',
      }
    ),
    JwtModule.register({
      secret: 'secretKey',
      signOptions: { expiresIn: '7d' }
    })
    , UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
