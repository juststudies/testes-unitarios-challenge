import { Statement } from "../../entities/Statement"


type ITransferenceOperationDTO = Pick<
    Statement, "sender_id" | "user_id" | "amount" | "description"
>

export{ITransferenceOperationDTO}