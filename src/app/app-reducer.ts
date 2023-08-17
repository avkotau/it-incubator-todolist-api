import { Dispatch } from "redux";
import { authAPI, Result_code } from "../api/todolist-api";
import { setIsLoggedInAC } from "../state/auth-reducer";
import { handleServerAppError, handleServerNetworkError } from "../utils/error-utils";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    // whether there is interaction with the server
    status: 'idle' as RequestStatusType,
    // if some kind of global error occurs, we will write the text here
    error: null as string | null,
    //there any interaction with the server now
    isInitialized: false
}

export type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: AppReducerActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case "APP/SET-ERROR":
            return {...state, error: action.error}
        case "APP/SET-IS-INITIALISED":
            return {...state, isInitialized: action.isInitialized}
        default:
            return {...state}
    }
}

export const initializeAppTC = () => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    try {
        const res = await authAPI.me()
        if (res.data.resultCode === Result_code.SUCCESS) {
            dispatch(setIsLoggedInAC(true))
            dispatch(setAppStatusAC('succeeded'))
        } else {
            handleServerAppError(dispatch, res.data)
        }
    } catch (e) {
        handleServerNetworkError(dispatch, e as string)
    } finally {
        dispatch(setIsInitializedAC(true))
    }
}

export const setAppStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)
export const setAppErrorAC = (error: string | null) => ({type: 'APP/SET-ERROR', error} as const)
export const setIsInitializedAC = (isInitialized: boolean) => ({type: 'APP/SET-IS-INITIALISED', isInitialized} as const)

export type SetAppErrorACType = ReturnType<typeof setAppErrorAC>
export type SetAppStatusACType = ReturnType<typeof setAppStatusAC>
export type SetIsInitializedACType = ReturnType<typeof setIsInitializedAC>

export type AppReducerActionsType = SetAppErrorACType | SetAppStatusACType | SetIsInitializedACType

