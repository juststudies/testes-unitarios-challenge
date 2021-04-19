import { OperationType } from "../../../modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "../../../modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { TransfersOperationUseCase } from "../../../modules/statements/useCases/transfersOperation/TransfersOperationUseCase";
import { TransfersOperationErrors } from "../../../modules/statements/useCases/transfersOperation/TransfersOperationError"

import { InMemoryUsersRepository } from "../../../modules/users/repositories/in-memory/InMemoryUsersRepository";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let transfersOperationUseCase: TransfersOperationUseCase;

describe("Transfers Operation", ()=>{
    beforeEach(()=>{
        inMemoryUsersRepository = new InMemoryUsersRepository();
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        transfersOperationUseCase = new TransfersOperationUseCase(
            inMemoryUsersRepository,
            inMemoryStatementsRepository
        );
    });

    it("should be able to make a transfer", async()=>{
        const sender = await inMemoryUsersRepository.create({
            email: "sender@test.com",
            name: "Sender Test Name",
            password: "pass_sender_test"
        });

        const receiver = await inMemoryUsersRepository.create({
            email: "receiver@test.com",
            name: "Receiver Test Name",
            password: "pass_receiver_test"
        });

        await inMemoryStatementsRepository.create({
            amount: 50,
            description: "Test deposit",
            type: OperationType.DEPOSIT,
            user_id: sender.id!
        });       

        await transfersOperationUseCase.execute({
            amount: 22,
            description: "Teste transfers",
            user_id: receiver.id!,
            sender_id: sender.id!
        });     

        const receiver_balance = await inMemoryStatementsRepository.getUserBalance({
            user_id: receiver.id!
        });

        const sender_balance = await inMemoryStatementsRepository.getUserBalance({
            user_id: sender.id!
        });
        
        expect(receiver_balance.balance).toEqual(22);                
        expect(sender_balance.balance).toEqual(28)
    });

    it("should not be able to make a transfer with a inexistent sender", async()=>{
        const receiver = await inMemoryUsersRepository.create({
            email: "receiver@test.com",
            name: "Receiver Test Name",
            password: "pass_receiver_test"
        });

        await expect(
            transfersOperationUseCase.execute({
                amount: 30,
                description: "test",
                user_id: receiver.id!,
                sender_id: "nope"
            })
        ).rejects.toEqual(new TransfersOperationErrors.UserNotFound());

    });

    it("should not be able to make a transfer with a inexistent receiver", async()=>{
        const sender = await inMemoryUsersRepository.create({
            email: "sender@test.com",
            name: "Sender Test Name",
            password: "pass_sender_test"
        });

        await expect(
            transfersOperationUseCase.execute({
                sender_id: sender.id!,
                amount:20,
                description: "test description",
                user_id: "not-exists"
            })
        ).rejects.toEqual(new TransfersOperationErrors.ReceiverNotFound())
    });

    it("should not be able to make a transfer if sender don't have funds enough", async()=>{
        const sender = await inMemoryUsersRepository.create({
            email: "sender@test.com",
            name: "Sender Test Name",
            password: "pass_sender_test"
        });

        const receiver = await inMemoryUsersRepository.create({
            email: "receiver@test.com",
            name: "Receiver Test Name",
            password: "pass_receiver_test"
        });

        await inMemoryStatementsRepository.create({
            amount: 50,
            description: "Test deposit",
            type: OperationType.DEPOSIT,
            user_id: sender.id!
        });       

        await expect(
            transfersOperationUseCase.execute({
                amount: 100,
                description: "Teste transfers",
                user_id: receiver.id!,
                sender_id: sender.id!
            })
        ).rejects.toEqual(new TransfersOperationErrors.InsufficientFundsForTransference());
    });
});