import { DefectanceModal } from "../Domain/M_HumanRecourse/Defects";


export const defectanceAdapter = (defectances: any[]): DefectanceModal[] => {


    return defectances.map((defect) => {
        return ({
            "id": defect?.name || "-",
            "title": defect.faName || "-",
            "description": defect.name || "-",
            "expiration": defect.expireDate || null,
            "faFirstName": defect?.faFirstName,
            "faLastName": defect?.faLastName,
            "lastName": defect?.lastName,
            "firstName": defect?.firstName,
        })
    });
};