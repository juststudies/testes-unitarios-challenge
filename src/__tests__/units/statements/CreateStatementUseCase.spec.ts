import { InMemoryStatementsRepository } from "../../../modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../../../modules/statements/useCases/createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../../../modules/statements/useCases/createStatement/ICreateStatementDTO";
import { InMemoryUsersRepository } from "../../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../modules/users/useCases/createUser/CreateUserUseCase";
import { AppError } from "../../../shared/errors/AppError";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Create statement", ()=>{
    beforeEach(()=>{
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    });

    it("should be able to create a new statement", async()=>{
        const user = await createUserUseCase.execute({
            email: "user@test.com",
            name: "Name Test",
            password: "test"
        });

        const statement = {
            user_id: user.id!,
            type: "deposit",
            amount: 100,
            description: "salary"
        } as ICreateStatementDTO;

        const response = await createStatementUseCase.execute(statement);

        expect(response).toHaveProperty("id");
    });

    it("should not be able to create a new statement with a non existent user", async ()=>{
        const statement = {
            user_id: "user-not-exists",
            type: "deposit",
            amount: 100,
            description: "salary"
        } as ICreateStatementDTO;

        await expect(createStatementUseCase.execute(statement)).rejects.toBeInstanceOf(AppError);
    });
});