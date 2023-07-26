export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

type RequestErrorType = {
    error: string
}

const initialState = {
    status: 'loading' as RequestStatusType
}

type InitialStateType = typeof initialState | RequestErrorType

export const appReducer = (state: InitialStateType = initialState, action: AppReducerActionsType): InitialStateType => {
    console.log('appReducer action', action)
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case "APP/SET-ERROR":
            return {...state, error: action.error}
        default:
            return {...state}
    }
}

export type AppReducerActionsType = ReturnType<typeof setAppStatusAC> | ReturnType<typeof setAppErrorAC>



export const setAppStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)
export const setAppErrorAC = (error: string) => ({type: 'APP/SET-ERROR', error} as const)

