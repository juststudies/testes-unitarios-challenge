import { InMemoryStatementsRepository } from "../../../modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../../../modules/statements/useCases/createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../../../modules/statements/useCases/createStatement/ICreateStatementDTO";
import { GetStatementOperationUseCase } from "../../../modules/statements/useCases/getStatementOperation/GetStatementOperationUseCase";
import { InMemoryUsersRepository } from "../../../modules/users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../modules/users/useCases/createUser/CreateUserUseCase";
import { AppError } from "../../../shared/errors/AppError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

describe("Get Statement Operation", ()=>{
    beforeEach(()=>{
        inMemoryUsersRepository = new InMemoryUsersRepository();
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
        getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
    });

    it("should be able to get statement operation", async()=>{
        const user = await createUserUseCase.execute({
            name: "Name Test",
            email: "user@test.com",
            password: "test"
        });

        const operation = {
            user_id: user.id!,
            amount: 100,
            description: "salary",
            type: "deposit"
        } as ICreateStatementDTO

        const statement = await createStatementUseCase.execute(operation);
        
        const response = await getStatementOperationUseCase.execute({
            user_id: user.id!,
            statement_id: statement.id!
        });

        expect(response).toHaveProperty("id");
        expect(response.user_id).toBe(statement.user_id);
    });

    it("should not be able to get statement operation from a non existing user", ()=>{
        expect(async()=>{
            const user = await createUserUseCase.execute({
                name: "Wrong",
                email: "wrong@fake.com",
                password: "wrong"
            });

            const operation = {
                user_id: user.id!,
                amount: 100,
                description: "salary",
                type: "deposit"
            } as ICreateStatementDTO

            const statement = await createStatementUseCase.execute(operation);

            await getStatementOperationUseCase.execute({
                user_id: "non-exists",
                statement_id: statement.id!
            });
        }).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able to get statement operation from a non existing statement", ()=>{
        
        expect(async()=>{
            const user = await createUserUseCase.execute({
                name: "Name Test",
                email: "user@test.com",
                password: "test"
            });

            await getStatementOperationUseCase.execute({
                user_id: user.id!,
                statement_id: "non-exists-statement"
            });            
        }).rejects.toBeInstanceOf(AppError);
    });
});