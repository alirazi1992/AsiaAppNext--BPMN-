import { InitializeStateCategoryModel } from "@/app/Domain/M_Education/Categories";
import { InitializeStateCourseModel } from "@/app/Domain/M_Education/Courses";
import { InitializeParticipantsState } from "@/app/Domain/M_Education/Participant";
import { InitializeStateProgramsModel } from "@/app/Domain/M_Education/Programs";

export var initializeCategoryState: InitializeStateCategoryModel = {
    totalCount: 0,
    searchKey: '',
    list: undefined,
    selectedCategory: undefined,
}

export var initializeCourseState: InitializeStateCourseModel = {
    courses: undefined,
    searchKey: '',
    selectedCourse: undefined,
    totalCount: 0,
    categories: undefined,
    templates: undefined
}

export var initializeProgramState: InitializeStateProgramsModel = {
    courses: undefined,
    totalCount: 0,
    searchKey: {
        categoryName: '',
        coachName: '',
        creationDateAfter: '',
        creationDateBefore: '',
        finishDateAfter: '',
        finishDateBefore: '',
        instituteName: '',
        name: '',
        participant: '',
        personnel: ''
    },
    programs: undefined,
    selectedProgram: undefined,
    participants: undefined,
    totalCountParticipants: 0
}

export var initializeStateParticipants : InitializeParticipantsState = {
    participants: undefined, 
    totalCount:0,
    certNo : 0,  
    searchKey: {
        courseProgramId: 0, faName: '', name: '', nationalCode: ''
    }
}
