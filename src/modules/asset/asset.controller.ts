import { AssetService } from './asset.service';
import { PaginatedDto } from '../../common/dto/filter-input.dto';
import { IsPublic } from '../../common/decorators/public.decorator';
import { ID } from '../../@types';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Asset')
@Controller('assets')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @IsPublic()
  @Get()
  findAll(@Query() filters: PaginatedDto) {
    return this.assetService.findAll(filters);
  }

  @IsPublic()
  @Get(':id')
  findOne(@Param('id') id: ID) {
    return this.assetService.findOne(id);
  }
}
