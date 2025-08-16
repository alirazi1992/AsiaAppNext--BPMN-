
export let initializeState = {
    documentData: undefined,
    docTypes: null,
    signers: [],
    documentImage: null,
    layouts: undefined,
    layoutId: 0
}

export let initializeParaphState = {
    paraphsList: []
}
export let initializeForwardsState = {
    forwardsList: []
}
export let initializeKeywordsState = {
    keywordsList: [],
    selected: []
}


export let initialStateFielsRepo = {
    classification: undefined,
    flowType: undefined,
    hasAttachment: undefined,
    priority: undefined
}

export let initializeStateKeywords = {
    relatedDocs: undefined,

}

export let relationOptions = [
    { label: "عطف", value: 1 },
    { label: "پیرو", value: 2 },
    { label: "پیوست", value: 3 },
    { label: "درارتباط", value: 4 }]