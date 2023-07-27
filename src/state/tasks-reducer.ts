// import { TaskType } from '../Todolist';
import { AddTodolistActionType, RemoveTodolistActionType, SetTodolistsActionType } from './todolists-reducer';
import { TasksStateType } from '../app/App';
import { Dispatch } from "redux";
import { Result_code, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType } from "../api/todolist-api";
import { AppRootStateType } from "./store";
import { setAppErrorAC, setAppStatusAC } from "../app/app-reducer";

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
                [action.todolistId]: action.tasks
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
            // найдём нужную таску:
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

        default:
            return state;
    }
}

export const changeTaskTitleAC = (todolistId: string, taskId: string, title: string): ChangeTaskTitleActionType => {
    return {type: 'CHANGE-TASK-TITLE', todolistId, taskId, title}
}


export const updateTaskTitleTC = (todolistId: string, taskId: string, title: string) => (dispatch: Dispatch, getState: () => AppRootStateType) => {

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
        })
        .catch(e => {
            dispatch(setAppErrorAC(e.message))
            dispatch(setAppStatusAC('failed'))
        })
}

export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todolistId: string): ChangeTaskStatusActionType => {
    return {type: 'CHANGE-TASK-STATUS', status, todolistId, taskId}
}

export const updateTaskStatusTC = (todolistId: string, taskId: string, status: TaskStatuses) => (dispatch: Dispatch, getState: () => AppRootStateType) => {

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
        })
        .catch(e => {
            dispatch(setAppErrorAC(e.message))
            dispatch(setAppStatusAC('failed'))
        })
}

export const addTaskAC = (task: TaskType): AddTaskActionType => {
    return {type: 'ADD-TASK', task}
}


export const createTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {

    dispatch(setAppStatusAC('loading'))

    todolistsAPI.createTask(todolistId, title)
        .then(res => {
            if (res.data.resultCode === Result_code.SUCCESS) {
                dispatch(addTaskAC(res.data.data.item))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                //показываем первую ошибку. При ее исправлении показываем следующую
                const error = res.data.messages[0]
                if (error) {
                    dispatch(setAppErrorAC(error))
                } else {

                    dispatch(setAppErrorAC('Some error'))
                }
                dispatch(setAppStatusAC('failed'))
            }
        })
        .catch(e => {
            dispatch(setAppErrorAC(e.message))
            dispatch(setAppStatusAC('failed'))
        })
}

export const removeTaskAC = (todolistId: string, taskId: string): RemoveTaskActionType => {
    return {type: 'REMOVE-TASK', todolistId: todolistId, taskId: taskId}
}
export const deleteTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch) => {

    dispatch(setAppStatusAC('loading'))
    todolistsAPI.deleteTask(todolistId, taskId)
        .then(res => {
            dispatch(removeTaskAC(todolistId, taskId))
            dispatch(setAppStatusAC('succeeded'))
        })
}

export const setTaskAC = (todolistId: string, tasks: TaskType[]): SetTaskSActionType => {
    return {type: 'SET-TASKS', todolistId, tasks}
}
export const getTaskTC = (todolistId: string) => (dispatch: Dispatch) => {

    dispatch(setAppStatusAC('loading'))
    todolistsAPI.getTasks(todolistId)
        .then(res => {
            dispatch(setTaskAC(todolistId, res.data.items))
            dispatch(setAppStatusAC('succeeded'))
        })
}
