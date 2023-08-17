import { todolistsAPI, TodolistType } from "../api/todolist-api";
import { Dispatch } from "redux";
import { RequestStatusType, setAppStatusAC } from "../app/app-reducer";
import { handleServerAppError, handleServerNetworkError } from "../utils/error-utils";
import { getTaskTC } from "./tasks-reducer";

const initialState: Array<TodolistDomainType> = [
    /*{id: todolistId1, title: 'What to learn', filter: 'all', addedDate: '', order: 0},
{id: todolistId2, title: 'What to buy', filter: 'all', addedDate: '', order: 0}*/
]

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: TodolistsActionsType): Array<TodolistDomainType> => {
    switch (action.type) {

        case "SET-TODOLISTS": {
            return action.todolists.map(tl => ({...tl, filter: 'all', emptyStatus: "idle"}))
        }

        case 'REMOVE-TODOLIST': {
            return state.filter(tl => tl.id !== action.id)
        }

        case 'ADD-TODOLIST': {
            return [
                {...action.todolist, filter: 'all', emptyStatus: "idle"},
                ...state]
        }

        case 'CHANGE-TODOLIST-TITLE': {
            const todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                // if found - change it title
                todolist.title = action.title;
            }
            return [...state]
        }

        case 'CHANGE-TODOLIST-FILTER': {
            const todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                // if found - change it title
                // todolist.filter = action.filter;
            }
            return [...state]
        }
        case "CHANGE-TODOLIST-STATUS": {
            return state.map(tl => (tl.id === action.id ? {...tl, emptyStatus: action.status} : tl))
        }

        case "CLEAR-DATA":
            return []

        default:
            return state;
    }
}

export const clearTodosDataAC = () => ({type: 'CLEAR-DATA'} as const)

export const changeTodolistFilterAC = (id: string, filter: FilterValuesType): ChangeTodolistFilterActionType => ({
    type: 'CHANGE-TODOLIST-FILTER', id: id, filter: filter
} as const)

export const changeTodolistTitleAC = (id: string, title: string): ChangeTodolistTitleActionType => ({
    type: 'CHANGE-TODOLIST-TITLE', id: id, title: title
} as const)

export const updateTodolistTC = (id: string, title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.updateTodolist(id, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(changeTodolistTitleAC(id, title))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        })
        .catch(error => {
            handleServerNetworkError(dispatch, error.message)
        })
}

export const changeTodolistStatusAC = (todolistId: string, status: RequestStatusType) => ({
    type: 'CHANGE-TODOLIST-STATUS', id: todolistId, status
} as const)


export const removeTodolistAC = (todolistId: string): RemoveTodolistActionType => (
    {type: 'REMOVE-TODOLIST', id: todolistId} as const)

export const removeTodolistTC = (id: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    dispatch(changeTodolistStatusAC(id, 'loading'))

    todolistsAPI.deleteTodolist(id)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(removeTodolistAC(id))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        })
        .catch(error => {
            dispatch(changeTodolistStatusAC(id, 'idle'))
            handleServerNetworkError(dispatch, error.message)
        })
}
export const addTodolistAC = (todolist: TodolistType): AddTodolistActionType => ({
    type: 'ADD-TODOLIST', todolist
} as const)

export const createTodolistTC = (title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.createTodolist(title)

        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(addTodolistAC(res.data.data.item))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(dispatch, res.data)
            }

        })
        .catch(error => {
            handleServerNetworkError(dispatch, error.message)
        })
}
export const setTodolistsAC = (todolists: TodolistType[]): SetTodolistsActionType => ({
    type: 'SET-TODOLISTS',
    todolists
} as const)

export const fetchTodolistsTC = () => (dispatch: any) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.getTodolists()
        .then(res => {
            dispatch(setTodolistsAC(res.data))
            dispatch(setAppStatusAC('succeeded'))
            return res.data
        })
        .then(todos => {
            todos.forEach(tl => {
                dispatch(getTaskTC(tl.id))
            })
        })
}

export type RemoveTodolistActionType = {
    type: 'REMOVE-TODOLIST',
    id: string
}
export type AddTodolistActionType = {
    type: 'ADD-TODOLIST',
    todolist: TodolistType
}
export type ChangeTodolistTitleActionType = {
    type: 'CHANGE-TODOLIST-TITLE',
    id: string
    title: string
}
export type ChangeTodolistFilterActionType = {
    type: 'CHANGE-TODOLIST-FILTER',
    id: string
    filter: FilterValuesType
}

export type SetTodolistsActionType = {
    type: 'SET-TODOLISTS'
    todolists: TodolistType[]
}
export type FilterValuesType = 'all' | 'active' | 'completed';

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    emptyStatus: RequestStatusType
}

export type ClearTodosDataACType = ReturnType<typeof clearTodosDataAC>

export type TodolistsActionsType = RemoveTodolistActionType | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType
    | ReturnType<typeof setTodolistsAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof changeTodolistStatusAC>
    | ClearTodosDataACType

