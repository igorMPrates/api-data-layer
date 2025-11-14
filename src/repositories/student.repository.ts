import * as sql from "mssql";
import {
  StudentRepository as StudentRepositoryInterface,
  Student,
  CreateStudentDTO,
  CreateStudentDTOSchema,
  UpdateStudentDTO,
  UpdateStudentDTOSchema,
  QueryOptions,
} from "../types";
import { InternalServerError, ValidationError } from "../errors";
import { BaseRepository } from "./base.repository";

export class StudentRepository
  extends BaseRepository
  implements StudentRepositoryInterface
{
  async getByRA(ra: string, options?: QueryOptions): Promise<Student | null> {
    try {
      const request = await this.getRequest(options ?? {});
      request.input("ra", sql.VarChar(50), ra);

      const result = await request.query<Student>(`
        SELECT 
          id,
          ra,
          name,
          email,
          createdAt,
          updatedAt
        FROM Students 
        WHERE ra = @ra
      `);

      return result.recordset[0] ?? null;
    } catch (error) {
      throw new InternalServerError({
        message: `Erro ao buscar student por RA: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`,
      });
    }
  }

  async getById(id: number, options?: QueryOptions): Promise<Student | null> {
    try {
      const request = await this.getRequest(options ?? {});
      request.input("id", sql.Int, id);

      const result = await request.query<Student>(`
        SELECT 
          id,
          ra,
          name,
          email,
          createdAt,
          updatedAt
        FROM Students 
        WHERE id = @id
      `);

      return result.recordset[0] ?? null;
    } catch (error) {
      throw new InternalServerError({
        message: `Erro ao buscar student por ID: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`,
      });
    }
  }

  async getByEmail(
    email: string,
    options?: QueryOptions
  ): Promise<Student | null> {
    try {
      const request = await this.getRequest(options ?? {});
      request.input("email", sql.VarChar(255), email);

      const result = await request.query<Student>(`
        SELECT 
          id,
          ra,
          name,
          email,
          createdAt,
          updatedAt
        FROM Students 
        WHERE email = @email
      `);

      return result.recordset[0] ?? null;
    } catch (error) {
      throw new InternalServerError({
        message: `Erro ao buscar student por email: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`,
      });
    }
  }

  async getAll(options?: QueryOptions): Promise<Student[]> {
    try {
      const request = await this.getRequest(options ?? {});

      const result = await request.query<Student>(`
        SELECT 
          id,
          ra,
          name,
          email,
          createdAt,
          updatedAt
        FROM Students
        ORDER BY name ASC
      `);

      return result.recordset;
    } catch (error) {
      throw new InternalServerError({
        message: `Erro ao listar students: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`,
      });
    }
  }

  async create(
    data: CreateStudentDTO,
    options?: QueryOptions
  ): Promise<Student> {
    const validationResult = CreateStudentDTOSchema.safeParse(data);
    if (!validationResult.success) {
      throw new ValidationError(validationResult.error);
    }

    try {
      const request = await this.getRequest(options ?? {});

      request.input("ra", sql.VarChar(50), data.ra);
      request.input("name", sql.VarChar(255), data.name);
      request.input("email", sql.VarChar(255), data.email);

      const result = await request.query<Student>(`
        INSERT INTO Students (ra, name, email, createdAt, updatedAt)
        OUTPUT INSERTED.*
        VALUES (@ra, @name, @email, GETDATE(), GETDATE())
      `);

      const created = result.recordset[0];
      if (!created) {
        throw new Error("Falha ao criar student");
      }

      return created;
    } catch (error) {
      throw new InternalServerError({
        message: `Erro ao criar student: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`,
      });
    }
  }

  async update(
    id: number,
    data: UpdateStudentDTO,
    options?: QueryOptions
  ): Promise<Student | null> {
    const validationResult = UpdateStudentDTOSchema.safeParse(data);
    if (!validationResult.success) {
      throw new ValidationError(validationResult.error);
    }

    try {
      const request = await this.getRequest(options ?? {});

      // Dynamic query construction based on provided fields
      const updateFields: string[] = [];

      if (data.name !== undefined) {
        request.input("name", sql.VarChar(255), data.name);
        updateFields.push("name = @name");
      }

      if (data.email !== undefined) {
        request.input("email", sql.VarChar(255), data.email);
        updateFields.push("email = @email");
      }

      if (updateFields.length === 0) {
        return this.getById(id, options);
      }

      request.input("id", sql.Int, id);
      updateFields.push("updatedAt = GETDATE()");

      const result = await request.query<Student>(`
        UPDATE Students
        SET ${updateFields.join(", ")}
        OUTPUT INSERTED.*
        WHERE id = @id
      `);

      return result.recordset[0] ?? null;
    } catch (error) {
      throw new InternalServerError({
        message: `Erro ao atualizar student: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`,
      });
    }
  }

  async delete(id: number, options?: QueryOptions): Promise<boolean> {
    try {
      const request = await this.getRequest(options ?? {});
      request.input("id", sql.Int, id);

      const result = await request.query(`
        DELETE FROM Students
        WHERE id = @id
      `);

      return (result.rowsAffected[0] ?? 0) > 0;
    } catch (error) {
      throw new InternalServerError({
        message: `Erro ao deletar student: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`,
      });
    }
  }
}
