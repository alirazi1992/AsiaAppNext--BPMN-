import { SelectOptionModel } from "@/app/Domain/shared";

export let docTypes: SelectOptionModel<number>[] = [{
    label: "صادره / اداری ",
    value: 1
}, {
    label: "وارده",
    value: 4
},
{
    label: "کاور لتر",
    value: 5
}]

export let initializeItem = {
    IsRevoked: false,
    Indicator: '',
    Passage: '',
    Keyword: '',
    MainReceiver: '',
    CopyReceiver: '',
    Sender: '',
    DocTypeId: 1,
    Subject: '',
    SubmitIndicator: '',
    ImportSubmitNo: '',
    CreateDateAfter: null,
    CreateDateBefore: null,
    SignDateAfter: null,
    SignDateBefore: null,
    SubmitDateAfter: null,
    SubmitDateBefore: null,
    ImportSubmitDateAfter: null,
    ImportSubmitDateBefore: null
}
