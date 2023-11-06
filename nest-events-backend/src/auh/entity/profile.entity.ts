//auth/entity/profile.entity.ts

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

Entity;
export class Profile {
  @PrimaryGeneratedColumn()
  id: Number;

  @Column()
  age: number;
}
