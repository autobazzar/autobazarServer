import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AdsModule } from './ads/ads.module';
import { RatesModule } from './rates/rates.module';
import { CommentsModule } from './comments/comments.module';
import { AdminModule } from './admin/admin.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Ad } from './ads/entities/ads.entity';
import { Rate } from './rates/entities/rate.entity';
import { Comment } from './comments/entities/comment.entity';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [
  
    TypeOrmModule.forRoot(
      {
        type: 'sqlite',
        database: 'db/sql',
        synchronize: true,
        entities: [User,Ad,Rate,Comment],
        logging: true,
        logger: 'file',
      }
    ),
    JwtModule.register({
      secret: 'secretKey',
      signOptions: { expiresIn: '7d' }
    })
    , UsersModule,AdsModule,RatesModule,AdminModule,CommentsModule ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
