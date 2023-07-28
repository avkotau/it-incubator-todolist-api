import { todolistsAPI, TodolistType } from "../api/todolist-api";
import { Dispatch } from "redux";
import { RequestStatusType, setAppErrorAC, setAppStatusAC } from "../app/app-reducer";

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

        default:
            return state;
    }
}

export const changeTodolistFilterAC = (id: string, filter: FilterValuesType): ChangeTodolistFilterActionType => {
    return {type: 'CHANGE-TODOLIST-FILTER', id: id, filter: filter}
}

export const changeTodolistTitleAC = (id: string, title: string): ChangeTodolistTitleActionType => {
    return {type: 'CHANGE-TODOLIST-TITLE', id: id, title: title}
}


export const updateTodolistTC = (id: string, title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.updateTodolist(id, title)
        .then(res => {
            dispatch(changeTodolistTitleAC(id, title))
            dispatch(setAppStatusAC('succeeded'))
        })
}

export const changeTodolistStatusAC = (todolistId: string, status: RequestStatusType) => {
    return {type: 'CHANGE-TODOLIST-STATUS', id: todolistId, status} as const
}


export const removeTodolistAC = (todolistId: string): RemoveTodolistActionType => {
    return {type: 'REMOVE-TODOLIST', id: todolistId}
}

export const removeTodolistTC = (id: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    dispatch(changeTodolistStatusAC(id, 'loading'))

    todolistsAPI.deleteTodolist(id)
        .then(res => {
            dispatch(removeTodolistAC(id))
            dispatch(setAppStatusAC('succeeded'))
        })
        .catch(e => {
            dispatch(changeTodolistStatusAC(id, 'idle'))
            dispatch(setAppErrorAC(e.message))
            dispatch(setAppStatusAC('failed'))
        })
}
export const addTodolistAC = (todolist: TodolistType): AddTodolistActionType => ({type: 'ADD-TODOLIST', todolist})

export const createTodolistTC = (title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.createTodolist(title)

        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(addTodolistAC(res.data.data.item))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                if (res.data.messages.length) {
                    dispatch(setAppErrorAC(res.data.messages[0]))
                } else {
                    dispatch(setAppErrorAC('Some error occurred'))
                }
                dispatch(setAppStatusAC('failed'))
            }

        })
        .catch(e => {
            dispatch(setAppErrorAC(e.message))
            dispatch(setAppStatusAC('failed'))
        })
}
export const setTodolistsAC = (todolists: TodolistType[]): SetTodolistsActionType => ({
    type: 'SET-TODOLISTS',
    todolists
} as const)

export const fetchTodolistsTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.getTodolists()
        .then(res => {
            const action = setTodolistsAC(res.data)
            dispatch(action)
            dispatch(setAppStatusAC('succeeded'))
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

export type TodolistsActionsType = RemoveTodolistActionType | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType
    | ReturnType<typeof setTodolistsAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof changeTodolistStatusAC>
