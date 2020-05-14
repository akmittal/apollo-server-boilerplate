import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  BeforeInsert,
  Index,
} from "typeorm";
import { hashSync } from "bcrypt";

interface IUser {
  firstName: string;

  lastName: string;

  email: string;

  username: string;

  password: string;
}

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  firstName: string;

  @Column()
  lastName: string;
  @Index()
  @Column({ unique: true })
  email: string;
  @Index()
  @Column({ unique: true })
  username: string;
  @Column()
  password: string;

  constructor(
    username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string
  ) {
    super();
    this.username = username;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
  }
  @BeforeInsert()
  hashPassword() {
    this.password = hashSync(this.password, 2);
  }
  toJSON() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      username: this.username,
      email: this.email,
    };
  }
}
