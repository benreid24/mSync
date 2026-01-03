import zod from 'zod';

export const GetPlaylistParamsSchema = zod.object({
    id: zod.coerce.number(),
});

export const CreatePlaylistBodySchema = zod.object({
    name: zod.string().min(1),
    source: zod.string().min(1),
    folder: zod.string().min(1),
});
