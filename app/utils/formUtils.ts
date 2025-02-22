import { z } from "zod";

export const getErrorMessage = (errors: z.ZodIssue[], fieldName: string) => {
  return errors.find((e) => e.path[0] === fieldName)?.message;
};
