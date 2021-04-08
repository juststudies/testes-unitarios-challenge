import { InMemoryUsersRepository } from "../../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../../../modules/users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../../modules/users/useCases/createUser/CreateUserUseCase";
import { AppError } from "../../../shared/errors/AppError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate user", ()=>{
    beforeEach(()=>{
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    });
    
    it("should be able to authenticate an user", async ()=>{
        const user = await createUserUseCase.execute({
            email: "user@test.com",
            name: "name test",
            password: "test"
        });

        const response = await authenticateUserUseCase.execute({
            email: user.email,
            password: "test",
        });

        expect(response).toHaveProperty("token");
        expect(response.user).toHaveProperty("id");
        expect(response.token.length).toBeGreaterThan(0);
    });

    it("should not be able to authenticate an inexisting user", ()=>{
        expect(async()=>{
            await authenticateUserUseCase.execute({
                email: "dont@exist.com",
                password: "wrong"
            });
        }).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able to authenticate with wrong password", ()=>{
        expect(async()=>{
            const user = await createUserUseCase.execute({
                email: "user@test.com",
                name: "name test",
                password: "test"
            });

            await authenticateUserUseCase.execute({
                email: user.email,
                password: "wrong"
            });
        }).rejects.toBeInstanceOf(AppError);
    });
});