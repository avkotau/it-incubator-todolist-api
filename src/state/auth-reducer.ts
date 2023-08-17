import { Dispatch } from "redux";
import { authAPI, Result_code } from "../api/todolist-api";
import { SetAppErrorACType, setAppStatusAC, SetAppStatusACType } from "../app/app-reducer";
import { handleServerAppError, handleServerNetworkError } from "../utils/error-utils";
import { FormType } from "../features/Login";
import { clearTodosDataAC, ClearTodosDataACType } from "./todolists-reducer";

const initialState = {
    isLoggedIn: false
}
type InitialStateType = typeof initialState

export const authReducer = (state: InitialStateType = initialState, action: ActionsType) => {
    switch (action.type) {
        case "login/SET-IS-LOGGED-IN":
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}

export const setIsLoggedInAC = (value: boolean) => ({type: 'login/SET-IS-LOGGED-IN', value} as const)

export const setIsLoggedInTC = (values: FormType) => async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    try {
        const res = await authAPI.login(values)
        if (res.data.resultCode === Result_code.SUCCESS) {
            dispatch(setIsLoggedInAC(true))
            dispatch(setAppStatusAC('succeeded'))
        } else {
            handleServerAppError(dispatch, res.data)
        }

    } catch (e) {
        handleServerNetworkError(dispatch, e as string)
    }
}

export const logoutTC = () => async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    try {
        const res = await authAPI.logout()
        if (res.data.resultCode === Result_code.SUCCESS) {
            dispatch(setIsLoggedInAC(false))
            dispatch(setAppStatusAC('succeeded'))
            dispatch(clearTodosDataAC())
        } else {
            handleServerAppError(dispatch, res.data)
        }

    } catch (e) {
        handleServerNetworkError(dispatch, (e as string))
    }
}

type ActionsType = ReturnType<typeof setIsLoggedInAC> | SetAppStatusACType | SetAppErrorACType | ClearTodosDataACType
