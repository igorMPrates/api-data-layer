# API Data Layer - SQL Server Repository Pattern

Camada de acesso a dados (Data Access Layer) completa para SQL Server usando TypeScript, implementando o **Repository Pattern** com segurança contra SQL Injection.

## 🎯 Características

- ✅ **100% Type-Safe**: TypeScript com modo strict habilitado
- ✅ **Segurança em Primeiro Lugar**: Todas as queries são parametrizadas (zero SQL injection)
- ✅ **Repository Pattern**: Abstração completa do SQL, camada de serviço agnóstica ao banco
- ✅ **Validação com Zod**: DTOs validados antes de chegar ao banco de dados
- ✅ **Suporte a Transações**: Para operações atômicas complexas
- ✅ **Connection Pool**: Gerenciamento eficiente de conexões
- ✅ **Error Handling**: Tratamento robusto de erros com mensagens descritivas

## 📦 Instalação

```bash
npm install
```

## ⚙️ Configuração

1. Copie o arquivo de exemplo de variáveis de ambiente:

```bash
cp .env.example .env
```

2. Configure suas credenciais do SQL Server no arquivo `.env`:

```env
DB_SERVER=localhost
DB_DATABASE=MyDatabase
DB_USER=sa
DB_PASSWORD=YourPassword123!
DB_PORT=1433
```

## 🚀 Uso

### Instanciar a camada de dados

```typescript
import { DB } from './db';
import { DatabaseConfig } from './types';

const config: DatabaseConfig = {
  server: 'localhost',
  database: 'MyDatabase',
  user: 'sa',
  password: 'YourPassword123!',
  port: 1433,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

const db = new DB(config);
```

### Exemplos de operações

```typescript
// Buscar student por RA
const student = await db.students.getByRA('123456');

// Criar um novo student
const newStudent = await db.students.create({
  ra: '789012',
  name: 'João Silva',
  email: 'joao.silva@example.com',
});

// Atualizar student
const updated = await db.students.update(student.id, {
  name: 'João Silva Santos',
});

// Listar todos
const all = await db.students.getAll();

// Deletar
await db.students.delete(student.id);
```

### Usando transações

```typescript
const transaction = await db.transaction();

try {
  await db.students.create(
    { ra: '111111', name: 'Maria', email: 'maria@example.com' },
    { transaction }
  );
  
  await db.students.create(
    { ra: '222222', name: 'Pedro', email: 'pedro@example.com' },
    { transaction }
  );
  
  await transaction.commit(); // Ambos salvos
} catch (error) {
  await transaction.rollback(); // Nenhum salvo
}
```

## 🏗️ Estrutura do Projeto

```
src/
├── db.ts           # Classe principal (Repository Pattern)
├── types.ts        # Interfaces, DTOs e validações Zod
└── index.ts        # Exemplos de uso
```

## 📝 Scripts

```bash
npm run dev         # Desenvolvimento com hot reload
npm run build       # Compila TypeScript para JavaScript
npm run start       # Executa a versão compilada
npm run type-check  # Verifica tipos sem compilar
```

## 🛡️ Segurança

**NUNCA** construa queries concatenando strings:

```typescript
// ❌ ERRADO - SQL Injection vulnerability
`SELECT * FROM Students WHERE RA = '${ra}'`

// ✅ CORRETO - Parametrizado
request.input('ra', sql.VarChar(50), ra);
request.query('SELECT * FROM Students WHERE RA = @ra');
```

## 🎨 Adicionando Novos Domínios

Para adicionar um novo domínio (ex: `Products`):

1. Defina a interface da entidade em `types.ts`
2. Crie a interface do repositório `IProductRepository`
3. Crie os DTOs e schemas Zod
4. Implemente o repositório em `db.ts`:

```typescript
public products: IProductRepository = {
  getById: async (id: number) => { /* ... */ },
  create: async (data: CreateProductDTO) => { /* ... */ },
  // ...
};
```

## 📚 Tecnologias

- **TypeScript**: Linguagem principal
- **mssql (Tedious)**: Driver para SQL Server
- **Zod**: Validação de schemas
- **tsx**: Execução TypeScript com hot reload

## 🤝 Contribuindo

Este projeto segue os princípios SOLID e o Repository Pattern. Ao adicionar funcionalidades:

1. Mantenha a camada de dados isolada
2. Use parametrização em todas as queries
3. Valide dados com Zod antes de operações
4. Escreva SQL otimizado (especifique colunas, use índices)
5. Use transações para operações múltiplas

## 📄 Licença

ISC
