import { DB } from "./db";
import { DatabaseConfig } from "./types";

/**
 * Exemplo de uso da camada de acesso a dados
 */
async function main() {
  // Configuração do banco de dados (use variáveis de ambiente em produção)
  const config: DatabaseConfig = {
    server: process.env["DB_SERVER"] || "localhost",
    database: process.env["DB_DATABASE"] || "MyDatabase",
    user: process.env["DB_USER"] || "sa",
    password: process.env["DB_PASSWORD"] || "YourPassword123!",
    port: parseInt(process.env["DB_PORT"] || "1433"),
    options: {
      encrypt: true,
      trustServerCertificate: true, // Use false em produção com certificado válido
      enableArithAbort: true,
    },
  };

  // Instancia a camada de dados
  const db = new DB(config);

  try {
    console.log("=== Exemplo 1: Buscar student por RA ===");
    const student1 = await db.students.getByRA("123456");
    console.log("Student encontrado:", student1);

    console.log("\n=== Exemplo 2: Criar um novo student ===");
    const newStudent = await db.students.create({
      ra: "789012",
      name: "João Silva",
      email: "joao.silva@example.com",
    });
    console.log("Student criado:", newStudent);

    console.log("\n=== Exemplo 3: Atualizar student ===");
    const updatedStudent = await db.students.update(newStudent.id, {
      name: "João Silva Santos",
      email: "joao.santos@example.com",
    });
    console.log("Student atualizado:", updatedStudent);

    console.log("\n=== Exemplo 4: Listar todos os students ===");
    const allStudents = await db.students.getAll();
    console.log(`Total de students: ${allStudents.length}`);
    console.log("Primeiros 3 students:", allStudents.slice(0, 3));

    console.log("\n=== Exemplo 5: Buscar por email ===");
    const studentByEmail = await db.students.getByEmail(
      "joao.santos@example.com"
    );
    console.log("Student encontrado por email:", studentByEmail);

    console.log(
      "\n=== Exemplo 6: Transação (criar múltiplos students atomicamente) ==="
    );
    const transaction = await db.transaction();

    try {
      const student1InTx = await db.students.create(
        {
          ra: "111111",
          name: "Maria Costa",
          email: "maria.costa@example.com",
        },
        { transaction }
      );
      console.log("Student 1 criado na transação:", student1InTx);

      const student2InTx = await db.students.create(
        {
          ra: "222222",
          name: "Pedro Oliveira",
          email: "pedro.oliveira@example.com",
        },
        { transaction }
      );
      console.log("Student 2 criado na transação:", student2InTx);

      // Commit da transação - ambos serão salvos
      await transaction.commit();
      console.log("✅ Transação commitada com sucesso!");
    } catch (error) {
      // Se houver erro, faz rollback - nenhum será salvo
      await transaction.rollback();
      console.error("❌ Erro na transação, rollback executado:", error);
    }

    console.log("\n=== Exemplo 7: Deletar student ===");
    const deleted = await db.students.delete(newStudent.id);
    console.log(`Student deletado: ${deleted ? "Sim" : "Não"}`);
  } catch (error) {
    console.error("Erro durante execução:", error);
  } finally {
    // Sempre feche a conexão ao terminar
    await db.close();
    console.log("\n✅ Conexão com banco de dados fechada.");
  }
}

// Executa o exemplo
main().catch(console.error);
