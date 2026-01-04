import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Callback {
  @PrimaryKey()
  id!: number;

  @Property()
  url!: string;

  @Property()
  eventType!: 'completed' | 'error';

  @Property({ type: "date" })
  createdAt: Date = new Date();

  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
