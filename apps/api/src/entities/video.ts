import { Entity, PrimaryKey, Property} from '@mikro-orm/core';

@Entity()
export class Video {
    @PrimaryKey()
    id!: number;

    @Property()
    videoId!: string;

    @Property()
    localPath!: string;
}
