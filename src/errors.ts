interface ErrorOptions {
  cause?: Error | unknown;
  message?: string;
  action?: string;
  statusCode?: number;
}

interface ErrorJSON {
  name: string;
  message: string;
  action: string;
  statusCode: number;
}

abstract class AppError extends Error {
  public override readonly name: string;

  public readonly action: string;

  public readonly statusCode: number;

  constructor(
    message: string,
    statusCode: number,
    action: string,
    cause?: Error | unknown
  ) {
    super(message, cause ? { cause } : undefined);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.action = action;
  }

  toJSON(): ErrorJSON {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      statusCode: this.statusCode,
    };
  }
}

/**
 * Erro customizado para erros internos do servidor
 */
export class InternalServerError extends AppError {
  constructor({ cause, statusCode }: ErrorOptions = {}) {
    super(
      "Um erro interno não esperado aconteceu",
      statusCode || 500,
      "Entre em contato com o suporte.",
      cause
    );
  }
}

/**
 * Erro de validação
 */
export class ValidationError extends AppError {
  constructor({ cause, message, action }: ErrorOptions = {}) {
    super(
      message || "Um erro de validação ocorreu",
      400,
      action || "Ajuste os dados enviados e tente novamente",
      cause
    );
  }
}
