import {
    AddTodolistActionType, ClearTodosDataACType,
    RemoveTodolistActionType,
    SetTodolistsActionType
} from './todolists-reducer';
import { TasksStateType } from '../app/App';
import { Dispatch } from "redux";
import {
    Result_code,
    TaskStatuses,
    TaskType,
    todolistsAPI,
    UpdateTaskModelType
} from "../api/todolist-api";
import { AppRootStateType } from "./store";
import { RequestStatusType, setAppStatusAC } from "../app/app-reducer";
import { handleServerAppError, handleServerNetworkError } from "../utils/error-utils";
import axios, { AxiosError } from "axios";

const initialState: TasksStateType = {
    /*"todolistId1": [
    { id: "1", title: "CSS", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
        startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
    { id: "2", title: "JS", status: TaskStatuses.Completed, todoListId: "todolistId1", description: '',
        startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
    { id: "3", title: "React", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
        startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
],
"todolistId2": [
    { id: "1", title: "bread", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
        startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
    { id: "2", title: "milk", status: TaskStatuses.Completed, todoListId: "todolistId2", description: '',
        startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
    { id: "3", title: "tea", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
        startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
]*/
}

export const tasksReducer = (state: TasksStateType = initialState, action: TacksActionsType): TasksStateType => {
    switch (action.type) {
        case "SET-TASKS": {
            return {
                ...state,
                [action.todolistId]: action.tasks.map(t => ({...t, emptyStatus: "idle"}))
            }
        }

        case "SET-TODOLISTS": {
            let newState = {...state}
            action.todolists.forEach(tl => {
                newState[tl.id] = []
            })
            return newState
        }

        case 'REMOVE-TASK': {
            const stateCopy = {...state}
            const tasks = stateCopy[action.todolistId];
            stateCopy[action.todolistId] = tasks.filter(t => t.id !== action.taskId);
            return stateCopy;
        }
        case 'ADD-TASK': {
            return {
                ...state,
                [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]
            }
        }

        case 'CHANGE-TASK-STATUS': {
            let todolistTasks = state[action.todolistId];
            state[action.todolistId] = todolistTasks
                .map(t => t.id === action.taskId ? {...t, status: action.status} : t);
            return ({...state});
        }

        case 'CHANGE-TASK-TITLE': {
            let todolistTasks = state[action.todolistId];
            // find the right task:
            state[action.todolistId] = todolistTasks
                .map(t => t.id === action.taskId ? {...t, title: action.title} : t);
            return ({...state});
        }

        case 'ADD-TODOLIST': {
            return {
                ...state,
                [action.todolist.id]: []
            }
        }

        case 'REMOVE-TODOLIST': {
            const copyState = {...state};
            delete copyState[action.id];
            return copyState;
        }

        case "CHANGE-EMPTY-TASK-STATUS": {
            let todolistTasks = state[action.todolistId];
            // find the right task:
            state[action.todolistId] = todolistTasks
                .map(t => t.id === action.taskId ? {...t, emptyStatus: action.status} : t);
            return ({...state});
        }

        case "CLEAR-DATA":
            return {}

        default:
            return state;
    }
}


export const changeEmptyTaskStatusAC = (todolistId: string, taskId: string, status: RequestStatusType) => ({
    type: 'CHANGE-EMPTY-TASK-STATUS', todolistId, taskId, status
} as const)


export const changeTaskTitleAC = (todolistId: string, taskId: string, title: string): ChangeTaskTitleActionType => ({
    type: 'CHANGE-TASK-TITLE', todolistId, taskId, title
} as const)


export const updateTaskTitleTC = (todolistId: string, taskId: string, title: string) => (dispatch: Dispatch, getState: () => AppRootStateType) => {
    dispatch(changeEmptyTaskStatusAC(todolistId, taskId, 'loading'))
    const task: TaskType = getState().tasks[todolistId].find(t => t.id === taskId)!

    const model: UpdateTaskModelType = {
        title,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        deadline: task.deadline,
        status: task.status
    }

    todolistsAPI.updateTask(todolistId, taskId, model)
        .then(res => {
            dispatch(changeTaskTitleAC(todolistId, taskId, title))
            dispatch(changeEmptyTaskStatusAC(todolistId, taskId, 'succeeded'))
        })

        //if type (e: ErrorType) then in e will be AxiosError.
        // AxiosError<ErrorType> typed response
        .catch((e: AxiosError<ErrorType>) => {

            //if true get message error sent by backend or internet error
            const error = e.response ? e.response?.data.messages[0].message : e.message
            handleServerNetworkError(dispatch, error)
        })
}

export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todolistId: string):
    ChangeTaskStatusActionType => ({
    type: 'CHANGE-TASK-STATUS', status, todolistId, taskId
} as const)

export const updateTaskStatusTC = (todolistId: string, taskId: string, status: TaskStatuses) =>
    (dispatch: Dispatch, getState: () => AppRootStateType) => {
        dispatch(changeEmptyTaskStatusAC(todolistId, taskId, 'loading'))
        dispatch(setAppStatusAC('loading'))

        const task: TaskType = getState().tasks[todolistId].find(t => t.id === taskId)!

        const model: UpdateTaskModelType = {
            title: task.title,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline,
            status
        }

        todolistsAPI.updateTask(todolistId, taskId, model)
            .then(res => {
                dispatch(changeTaskStatusAC(taskId, status, todolistId))
                dispatch(setAppStatusAC('succeeded'))
                dispatch(changeEmptyTaskStatusAC(todolistId, taskId, 'succeeded'))
            })
            .catch(e => {
                handleServerNetworkError(dispatch, e.message)
            })
    }

export const addTaskAC = (task: TaskType): AddTaskActionType => ({
    type: 'ADD-TASK', task
} as const)

export const createTaskTC = (todolistId: string, title: string) => async (dispatch: Dispatch) => {

    dispatch(setAppStatusAC('loading'))
    try {
        const res = await todolistsAPI.createTask(todolistId, title)

        if (res.data.resultCode === Result_code.SUCCESS) {
            dispatch(addTaskAC(res.data.data.item))
            dispatch(setAppStatusAC('succeeded'))
        } else {
            handleServerAppError(dispatch, res.data)
        }
    } catch (e) {
        if (axios.isAxiosError<ErrorType>(e)) {
            const error = e.response ? e.response?.data.messages[0].message : e.message
            handleServerNetworkError(dispatch, error)
        }
        const error = (e as Error).message
        handleServerNetworkError(dispatch, error)
    }
}

export const removeTaskAC = (todolistId: string, taskId: string): RemoveTaskActionType => ({
    type: 'REMOVE-TASK', todolistId: todolistId, taskId: taskId
} as const)
export const deleteTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch) => {
    dispatch(changeEmptyTaskStatusAC(todolistId, taskId, 'loading'))
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.deleteTask(todolistId, taskId)
        .then(res => {
            dispatch(removeTaskAC(todolistId, taskId))
            dispatch(setAppStatusAC('succeeded'))
            dispatch(changeEmptyTaskStatusAC(todolistId, taskId, 'succeeded'))
        })
}

export const setTaskAC = (todolistId: string, tasks: TaskType[]): SetTaskSActionType => ({
    type: 'SET-TASKS', todolistId, tasks
} as const)
export const getTaskTC = (todolistId: string) => (dispatch: Dispatch) => {

    dispatch(setAppStatusAC('loading'))
    todolistsAPI.getTasks(todolistId)
        .then(res => {
            dispatch(setTaskAC(todolistId, res.data.items))
            dispatch(setAppStatusAC('succeeded'))
        })
}

type ErrorType = {
    statusCode: number,
    messages: [
        {
            message: string,
            field: string
        }
    ],
    error: string
}

export type RemoveTaskActionType = {
    type: 'REMOVE-TASK',
    todolistId: string
    taskId: string
}

export type AddTaskActionType = {
    type: 'ADD-TASK',
    task: TaskType
}

export type SetTaskSActionType = {
    type: 'SET-TASKS'
    todolistId: string
    tasks: TaskType[]
}

export type TaskDomainType = {
    emptyStatus: RequestStatusType
}

export type ChangeTaskStatusActionType = {
    type: 'CHANGE-TASK-STATUS',
    todolistId: string
    taskId: string
    status: TaskStatuses
}

export type ChangeTaskTitleActionType = {
    type: 'CHANGE-TASK-TITLE',
    todolistId: string
    taskId: string
    title: string
}

export type TacksActionsType = RemoveTaskActionType | AddTaskActionType
    | ChangeTaskStatusActionType
    | ChangeTaskTitleActionType
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType
    | SetTaskSActionType
    | ReturnType<typeof changeEmptyTaskStatusAC>
    | ClearTodosDataACType
