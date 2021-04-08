import { InMemoryUsersRepository } from "../../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../modules/users/useCases/createUser/CreateUserUseCase";
import { AppError } from "../../../shared/errors/AppError";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create user", ()=>{
    beforeEach(()=>{
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    });

    it("should be able to create a new user", async ()=>{
        const user = await createUserUseCase.execute({
            email: "eltojohn@fbi.com",
            name: "Elto John",
            password: "1234"
        });
        
        expect(user).toHaveProperty("id");
    });

    it("should not be able to create a new user with existing email", async ()=>{
        expect(async ()=>{
            await createUserUseCase.execute({
                email: "eltojohn@fbi.com",
                name: "Elto John",
                password: "1234"
            });
    
            await createUserUseCase.execute({
                email: "eltojohn@fbi.com",
                name: "Elto John",
                password: "1234"
            });
        }).rejects.toBeInstanceOf(AppError);        
    });
});