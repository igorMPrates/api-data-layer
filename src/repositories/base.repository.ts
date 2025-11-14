import * as sql from "mssql";
import { QueryOptions } from "../types";

export abstract class BaseRepository {
  constructor(protected db: DatabaseContext) {}

  protected async getRequest(options: QueryOptions = {}): Promise<sql.Request> {
    return this.db.getRequest(options);
  }
}

export interface DatabaseContext {
  getRequest(options?: QueryOptions): Promise<sql.Request>;
}
