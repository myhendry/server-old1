import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany
} from "typeorm";
import { Picture } from "./Picture";

@Entity("users")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar", { length: 255 })
  email: string;

  @Column("text")
  password: string;

  @Column("text")
  name: string;

  @Column()
  age: number;

  @OneToMany(() => Picture, picture => picture.user, {
    onDelete: "CASCADE"
  })
  pictures: Picture[];

  // @OneToMany(() => Photo, photo => photo.user, {
  //   onDelete: "CASCADE"
  // }) // note: we will create author property in the Photo class below
  // photos: Photo[];

  // @OneToOne(() => Details, details => details.user, {
  //   cascade: true,
  //   onDelete: "CASCADE"
  // })
  // userDetails: Details;

  // @ManyToMany(() => Category, category => category.users, {
  //   onDelete: "CASCADE"
  // })
  // categories: Category[];
}
