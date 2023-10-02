import { AssetService } from './asset.service';
import { PaginatedInput } from '../../common/dto/filter-input';
import { IsPublic } from '../../decorators/public.decorator';
import { ID } from '../../@types';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Asset')
@Controller('assets')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @IsPublic()
  @Get()
  findAll(@Query() filters: PaginatedInput) {
    return this.assetService.findAll(filters);
  }

  @IsPublic()
  @Get(':id')
  findOne(@Param('id') id: ID) {
    return this.assetService.findOne(id);
  }
}
