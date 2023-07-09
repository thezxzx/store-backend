import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {
    unique: true,
  })
  email: string;

  @Column('varchar', {
    select: false,
  })
  password: string;

  @Column('varchar', {
    unique: true,
  })
  username: string;

  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  @Column('varchar', {
    array: true,
    default: ['user'],
  })
  roles: string[];

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
