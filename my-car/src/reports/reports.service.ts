import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/createReport.dto';
import { User } from 'src/users/user.entity';
import { GetEstimateDto } from './dtos/getEstimate.dto';
@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  create(report: CreateReportDto, user: User) {
    const newReport = this.repo.create(report);
    newReport.user = user;
    return this.repo.save(newReport);
  }

  async changeApproval(id: number, approved: boolean) {
    const report = await this.repo.findOne({ where: { id } });
    if (!report) {
      throw new NotFoundException('report not found');
    }
    report.approved = approved;
    return this.repo.save(report);
  }

  getEstimate({ make, model, year, lat, lng, mileage }: GetEstimateDto) {
    return this.repo
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make=:make', { make })
      .andWhere('model=:model', { model })
      .andWhere('year=:year', { year })
      .andWhere('lat-:lat/111.2>=lng-:lng/111.2', { lat, lng })
      .andWhere('lat+:lat/111.2<=lng+:lng/111.2', { lat, lng })
      .orderBy('ABS(lat-:lat)+ABS(lng-:lng)', 'ASC')
      .setParameters({ mileage })
      .getRawMany();
  }
}
