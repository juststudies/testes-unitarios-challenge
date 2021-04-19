import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType, Statement } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { ITransferenceOperationDTO } from "./ITransfersOperationDTO";
import { TransfersOperationErrors } from "./TransfersOperationError";

@injectable()
class TransfersOperationUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,

        @inject("StatementsRepository")
        private statementsRepository: IStatementsRepository
    ){}

    async execute({
        sender_id,
        user_id,
        amount,
        description

    }:ITransferenceOperationDTO):Promise<Statement>{
        const sender = await this.usersRepository.findById(sender_id);

        if(!sender){
            throw new TransfersOperationErrors.UserNotFound();
        }

        const receiver = await this.usersRepository.findById(user_id);

        if(!receiver){
            throw new TransfersOperationErrors.ReceiverNotFound();
        }

        let { balance } = await this.statementsRepository.getUserBalance({
            user_id: sender_id
        });

        if(balance < amount){
            throw new TransfersOperationErrors.InsufficientFundsForTransference();
        }

        const transfer = await this.statementsRepository.create({
            sender_id,
            user_id,
            amount,
            description,
            type:OperationType.TRANSFER,
        });

        return transfer;
    }
}

export{TransfersOperationUseCase}