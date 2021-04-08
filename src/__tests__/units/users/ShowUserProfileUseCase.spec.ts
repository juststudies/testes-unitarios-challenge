import { InMemoryUsersRepository } from "../../../modules/users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../modules/users/useCases/createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "../../../modules/users/useCases/showUserProfile/ShowUserProfileUseCase";
import { AppError } from "../../../shared/errors/AppError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;
describe("Show user profile", ()=>{
    beforeEach(()=>{
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
    });

    it("should be able to show the user profile", async ()=>{
        const user = await createUserUseCase.execute({
            email: "user@test.com",
            name: "Test Name",
            password: "test"
        });

        const response = await showUserProfileUseCase.execute(user.id!);

        expect(response).toHaveProperty("email");
        expect(response.name).toBe(user.name);
    });

    it("should not be able to show a profile if user does not exists", ()=>{
        expect(async ()=>{
            await showUserProfileUseCase.execute("this-id-not-exists");
        }).rejects.toBeInstanceOf(AppError);
    });
});