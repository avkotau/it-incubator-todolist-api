import {
    AppReducerActionsType,
    setAppErrorAC,
    setAppStatusAC,
} from '../app/app-reducer'
import { Dispatch } from 'redux'
import { ResponseType } from '../api/todolist-api'

// generic function
export const handleServerAppError = <T>(dispatch: Dispatch<AppReducerActionsType>, data: ResponseType<T>) => {
    if (data.messages.length) {
        // show  first error
        dispatch(setAppErrorAC(data.messages[0]))
    } else {
        dispatch(setAppErrorAC('Some error occurred'))
    }
    dispatch(setAppStatusAC('failed'))
}

export const handleServerNetworkError = (dispatch: Dispatch<AppReducerActionsType>, error: string ) => {
    dispatch(setAppErrorAC(error))
    dispatch(setAppStatusAC('failed'))
}
