import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BaseEntity,
  ManyToOne,
} from "typeorm";
import { User } from "./User";
import { BubbleComment } from "./BubbleComment";
import { LikedBubble } from "./LikedBubble";
import { QueryOrder } from "../@type/query";

@Entity({
  name: "Bubbles",
})
export class Bubble extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  image!: string;

  @Column()
  thumbnail!: string;

  @Column()
  sound!: string;

  @Column()
  textContent!: string;

  @CreateDateColumn({ name: "createdAt" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updatedAt" })
  updatedAt!: Date;

  @Column()
  userId!: number;

  @ManyToOne(() => User, (user) => user.bubbles, { onDelete: "CASCADE" })
  user!: User;

  @OneToMany(() => BubbleComment, (bubbleComment) => bubbleComment.bubble)
  bubbleComments!: BubbleComment[];

  @OneToMany(() => LikedBubble, (likedBubble) => likedBubble.bubble)
  likedBubbles!: BubbleComment[];

  static async insertBubble(
    userId: number,
    textContent: string,
    imageSrc: string,
    soundSrc: string,
    thumbnailSrc: string
  ): Promise<Bubble> {
    const newBubble: Bubble = new Bubble();
    newBubble.userId = userId;
    newBubble.textContent = textContent;
    newBubble.image = imageSrc;
    newBubble.thumbnail = thumbnailSrc;
    newBubble.sound = soundSrc;
    await newBubble.save();
    return newBubble;
  }

  //* 모든 버블 조회 (검색 옵션 사용 가능)
  static async findAllBubbles(
    start: number,
    end: number,
    limit: number | undefined,
    order: QueryOrder
  ): Promise<Bubble[]> {
    const bubbles: Bubble[] = await this.createQueryBuilder("bubble")
      .where("bubble.id >= :sId AND bubble.id <= :eId", { sId: start, eId: end })
      .limit(limit)
      .leftJoinAndSelect("bubble.user", "user")
      .select([
        "bubble.id",
        "bubble.image",
        "bubble.thumbnail",
        "bubble.sound",
        "bubble.textContent",
        "bubble.createdAt",
        "user.email",
        "user.nickname",
      ])
      .orderBy("bubble.id", order)
      .getMany();
    return bubbles;
  }

  //* 특정 버블 조회
  static async findBubble(bubbleId: number): Promise<Bubble | undefined> {
    const bubble: Bubble | undefined = await this.createQueryBuilder("bubble")
      .where("bubble.id = :id", { id: bubbleId })
      .leftJoinAndSelect("bubble.user", "user")
      .select([
        "bubble.id",
        "bubble.image",
        "bubble.thumbnail",
        "bubble.sound",
        "bubble.textContent",
        "bubble.createdAt",
        "user.email",
        "user.nickname",
      ])
      .getOne();
    return bubble;
  }

  //* 특정 유저의 버블 조회
  static async findBubblesByUserId(userId: number): Promise<Bubble[]> {
    const bubbles: Bubble[] = await this.createQueryBuilder("bubble")
      .where("bubble.userId = :userId", { userId: userId })
      .leftJoinAndSelect("bubble.user", "user")
      .select(["bubble.id", "bubble.thumbnail", "bubble.image", "bubble.sound", "bubble.textContent", "bubble.createdAt", "user.email", "user.nickname"])
      .orderBy("bubble.id", "DESC")
      .getMany();
    return bubbles;
  }
}
