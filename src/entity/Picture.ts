import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  BaseEntity
} from "typeorm";
import { User } from "./User";

@Entity("pictures")
export class Picture extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text")
  title: string;

  @Column("varchar")
  pictureUrl: string;

  @Column("uuid")
  userId: string;

  @ManyToOne(() => User, user => user.pictures)
  user: User;
}
