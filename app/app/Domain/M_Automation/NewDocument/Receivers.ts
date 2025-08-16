import { SelectOptionModel } from "../../shared";

export interface GetReceiversModel extends SelectOptionModel<number> {
        EnValue: string,
        Level: number,
        Id: number,
        Value: string,
        Name: string,
        FaName: string
}

export interface GetMainReceiver {
        ActionId: number | undefined,
        ActionName: string | undefined,
        Description: string | null,
        EnValue: string,
        Id: number,
        Level: number,
        Value: string
}
