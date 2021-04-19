import { Request, Response } from "express";
import { container } from "tsyringe";

import { TransfersOperationUseCase } from "./TransfersOperationUseCase";

class TransfersOperationController{
    async handle(request:Request, response:Response): Promise<Response>{
        const sender_id = request.user.id;
        const { user_id } = request.params;
        const {amount, description} = request.body;
        const transfersOperationUseCase = container.resolve(TransfersOperationUseCase);

        const transfer = await transfersOperationUseCase.execute({
            sender_id,
            user_id,
            amount,
            description,
        });
        return response.json(transfer);
    }
}

export{TransfersOperationController}