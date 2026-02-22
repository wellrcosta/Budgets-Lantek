import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { BudgetsModule } from './budgets/budgets.module';
import { ItemsModule } from './items/items.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // TODO: Disable in production
      logging: process.env.NODE_ENV === 'development',
    }),
    AuthModule,
    UsersModule,
    OrganizationsModule,
    BudgetsModule,
    ItemsModule,
  ],
})
export class AppModule {}
