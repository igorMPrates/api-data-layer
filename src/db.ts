import * as sql from "mssql";
import {
  DatabaseConfig,
  DatabaseConfigSchema,
  StudentRepository as StudentRepositoryInterface,
  QueryOptions,
} from "./types";
import { ValidationError, InternalServerError } from "./errors";
import { StudentRepository, DatabaseContext } from "./repositories";

export class DB implements DatabaseContext {
  private pool: sql.ConnectionPool | null = null;
  private configuration: sql.config;
  public readonly students: StudentRepositoryInterface;

  constructor(config: DatabaseConfig) {
    const validationResult = DatabaseConfigSchema.safeParse(config);
    if (!validationResult.success) {
      throw new ValidationError(validationResult.error);
    }

    this.configuration = {
      server: config.server,
      database: config.database,
      user: config.user,
      password: config.password,
      port: config.port,
      options: {
        encrypt: config.options?.encrypt ?? true,
        trustServerCertificate: config.options?.trustServerCertificate ?? false,
        enableArithAbort: config.options?.enableArithAbort ?? true,
      },
      requestTimeout: config.options?.requestTimeout ?? 30000,
      connectionTimeout: config.options?.connectionTimeout ?? 15000,
    };

    this.students = new StudentRepository(this);
  }

  private async getPool(): Promise<sql.ConnectionPool> {
    if (this.pool && this.pool.connected) {
      return this.pool;
    }

    try {
      this.pool = await sql.connect(this.configuration);
      return this.pool;
    } catch (error) {
      throw new InternalServerError({
        message: `Erro ao conectar com o banco de dados: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`,
      });
    }
  }

  public async getRequest(options: QueryOptions = {}): Promise<sql.Request> {
    if (options.transaction) {
      return new sql.Request(options.transaction);
    }

    const pool = await this.getPool();
    return new sql.Request(pool);
  }

  async transaction(): Promise<sql.Transaction> {
    const pool = await this.getPool();
    const transaction = new sql.Transaction(pool);
    await transaction.begin();
    return transaction;
  }

  async close(): Promise<void> {
    if (this.pool) {
      await this.pool.close();
      this.pool = null;
    }
  }
}
