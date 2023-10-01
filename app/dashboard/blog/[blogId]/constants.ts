import { z } from "zod";

export const commonPostPayloadSchema = z.object({
  coverImagePath: z.string().nullish(),
  apiKey: z.string().nullish(),
  blogId: z.string().nonempty(),
  type: z.enum(["PUBLISH", "REPUBLISH"]),
});

export const devToPostPayloadSchema = commonPostPayloadSchema.extend({
  tags: z.array(z.string()),
});

export const hashNodePostPayloadSchema = commonPostPayloadSchema.extend({
  username: z.string().nullish(),
  tags: z.array(z.object({ _id: z.string() })),
  subtitle: z.string().optional(),
  slug: z.string().nonempty(),
});
