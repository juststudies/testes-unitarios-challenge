import { Statement } from "../entities/Statement";

type IOptionalSenderId = Pick<Statement, "sender_id">

type ICreateStatementRepositoryDTO = Pick<
    Statement, "user_id" | "description" | "amount" | "type"
> & Partial<IOptionalSenderId>

export { ICreateStatementRepositoryDTO }