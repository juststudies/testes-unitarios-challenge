import { InMemoryStatementsRepository } from "../../../modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceUseCase } from "../../../modules/statements/useCases/getBalance/GetBalanceUseCase";
import { InMemoryUsersRepository } from "../../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../modules/users/useCases/createUser/CreateUserUseCase";
import { AppError } from "../../../shared/errors/AppError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get Balance",()=>{
    beforeEach(()=>{
        inMemoryUsersRepository = new InMemoryUsersRepository();
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository)
    });

    it("should be able to get balance", async ()=>{
        const user = await createUserUseCase.execute({
            email: "user@test.com",
            name: "Name Test",
            password: "test"
        });

        const response = await getBalanceUseCase.execute({user_id: user.id!});
        
        expect(response).toHaveProperty("statement");
        expect(response).toHaveProperty("balance");
    });

    it("should not be able to get a balance with a non inexistent user", ()=>{
        expect(async ()=>{
            await getBalanceUseCase.execute({user_id: "non-existing-id"})
        }).rejects.toBeInstanceOf(AppError);
    });
});