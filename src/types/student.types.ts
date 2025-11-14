import { z } from "zod";
import { QueryOptions } from "./database.types";

export const StudentSchema = z.object({
  id: z.number(),
  ra: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Student = z.infer<typeof StudentSchema>;

export const CreateStudentDTOSchema = z.object({
  ra: z.string().min(6, "RA deve ter no mínimo 6 caracteres"),
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
});

export type CreateStudentDTO = z.infer<typeof CreateStudentDTOSchema>;

export const UpdateStudentDTOSchema = z.object({
  name: z.string().min(3).optional(),
  email: z.string().email().optional(),
});

export type UpdateStudentDTO = z.infer<typeof UpdateStudentDTOSchema>;

export interface StudentRepository {
  getByRA(ra: string, options?: QueryOptions): Promise<Student | null>;
  getById(id: number, options?: QueryOptions): Promise<Student | null>;
  getByEmail(email: string, options?: QueryOptions): Promise<Student | null>;
  getAll(options?: QueryOptions): Promise<Student[]>;
  create(data: CreateStudentDTO, options?: QueryOptions): Promise<Student>;
  update(
    id: number,
    data: UpdateStudentDTO,
    options?: QueryOptions
  ): Promise<Student | null>;
  delete(id: number, options?: QueryOptions): Promise<boolean>;
}
