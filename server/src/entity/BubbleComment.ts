import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
} from "typeorm";
import { User } from "./User";
import { Bubble } from "./Bubble";

@Entity({
  name: "BubbleComments",
})
export class BubbleComment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  textContent!: string;

  @CreateDateColumn({ name: "createdAt" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updatedAt" })
  updatedAt!: Date;

  @ManyToOne((type) => Bubble, (bubble) => bubble.bubbleComments, { onDelete: "CASCADE" })
  bubble!: Bubble;

  @ManyToOne((type) => User, (user) => user.bubbles, { onDelete: "CASCADE" })
  user!: User;
}