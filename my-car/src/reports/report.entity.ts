import { User } from 'src/users/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: number;

  @Column({ default: false })
  approved: boolean; // 是否被批准

  @Column()
  make: string; // 制造商

  @Column()
  model: string; // 车辆类型

  @Column()
  year: number; // 年份

  @Column()
  lng: number; // 经度

  @Column()
  lat: number; // 纬度

  @Column()
  mileage: number; // 里程

  @ManyToOne(() => User, (user) => user.reports)
  user: User;
}
