import { z } from "zod";
import * as sql from "mssql";

export const DatabaseConfigSchema = z.object({
  server: z.string().min(1, "Server é obrigatório"),
  database: z.string().min(1, "Database é obrigatório"),
  user: z.string().min(1, "User é obrigatório"),
  password: z.string().min(1, "Password é obrigatório"),
  port: z.number().optional(),
  options: z
    .object({
      encrypt: z.boolean().optional(),
      trustServerCertificate: z.boolean().optional(),
      enableArithAbort: z.boolean().optional(),
      requestTimeout: z.number().optional(),
      connectionTimeout: z.number().optional(),
    })
    .optional(),
});

export type DatabaseConfig = z.infer<typeof DatabaseConfigSchema>;

export interface QueryOptions {
  transaction?: sql.Transaction;
}
