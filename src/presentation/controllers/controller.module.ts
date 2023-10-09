import { Module } from '@nestjs/common';
import { AppController } from './app/app.controller';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [AdminModule],
  controllers: [AppController],
})
export class ControllerModule {}
