import { Module } from '@nestjs/common';
import { AssetService } from './asset.service';
import { AssetController } from '../../presentation/controllers/asset/asset.controller';
import { DatabaseModule } from '../../infra/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [AssetService],
  controllers: [AssetController],
  exports: [AssetService],
})
export class AssetModule {}
