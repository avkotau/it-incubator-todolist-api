import axios from 'axios'

const instance = axios.create(
    {
        baseURL: `https://social-network.samuraijs.com/api/1.1/`,
        withCredentials: true,
    }
)

export const taskAPI = {

    getTasks(todolistId: string) {
        return instance.get<TaskType>(`todo-lists/${todolistId}/tasks`)
    },

    createTask(todolistId: string, title: string) {
        return instance.post<ResponseType<{items: ItemType}>>(`todo-lists/${todolistId}/tasks`, {title})
    },

    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseType<{}>>(`todo-lists/${todolistId}/tasks/${taskId}`)

    },

    updateTask(todolistId: string, taskId: string, title: string) {
        return instance.put<ResponseType<{items: ItemType}>>(
            `todo-lists/${todolistId}/tasks/${taskId}`,
            {title}
        )
    },
}

type ItemType = {
    addedDate: string
    deadline: boolean
    description: boolean
    id: string
    order: number
    priority: number
    startDate: boolean
    status: number
    title: string
    todoListId: string
}

type TaskType = {
    items: ItemType[]
    totalCount: number
    error: boolean
}

type ResponseType<T> = {
    data: T
    fieldsErrors: []
    messages: []
    resultCode: number
}
