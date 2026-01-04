import zod from "zod";

export const CallbackIdSchema = zod.object({
  id: zod.coerce.number(),
});

export const NewCallbackSchema = zod.object({
  url: zod.string().url(),
  eventType: zod.enum(["completed", "error"]),
});

export type NewCallback = zod.infer<typeof NewCallbackSchema>;

export const CallbackSchema = NewCallbackSchema.extend({
  id: zod.number(),
  createdAt: zod.date(),
  updatedAt: zod.date(),
});

export type Callback = zod.infer<typeof CallbackSchema>;
