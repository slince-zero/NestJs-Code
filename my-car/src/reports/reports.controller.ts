import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateReportDto } from './dtos/createReport.dto';
import { ReportsService } from './reports.service';
import { Authguard } from '../guards/auth.guard';
import { Adminguard } from '../guards/admin.guard';
import { CurrentUser } from 'src/users/decorators/currentUser.decorator';
import { User } from 'src/users/user.entity';
import { ReportDto } from './dtos/report.dto';
import { Serialize } from 'src/interceptor/serialize.interceptor';
import { ApproveReportDto } from '../reports/dtos/approveReport.dto';
import { GetEstimateDto } from './dtos/getEstimate.dto';

@Controller('reports')
export class ReportsController {
  constructor(private reportService: ReportsService) {}

  @Post()
  @UseGuards(Authguard)
  @Serialize(ReportDto)
  creatReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportService.create(body, user);
  }

  @Patch('/:id')
  @UseGuards(Adminguard)
  approveReport(@Param('id') id: number, @Body() body: ApproveReportDto) {
    return this.reportService.changeApproval(id, body.approved);
  }

  @Get()
  getEstimate(@Query() query: GetEstimateDto) {
    return this.reportService.getEstimate(query);
  }
}
