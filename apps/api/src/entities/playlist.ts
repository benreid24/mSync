import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Playlist {
    @PrimaryKey()
    id!: number;

    @Property()
    name!: string;

    @Property()
    source!: string;

    @Property()
    folder!: string;

    @Property({type: 'date', nullable: true})
    lastChecked: Date | null = null;

    @Property({ type: 'date', nullable: true })
    lastFetched: Date | null = null;

    @Property({ type: 'date' })
    createdAt: Date = new Date();

    @Property({ type: 'date', onUpdate: () => new Date() })
    updatedAt: Date = new Date();
}
