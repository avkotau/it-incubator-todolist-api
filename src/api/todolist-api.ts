import axios from 'axios'

const instance = axios.create(
    {
        baseURL: `https://social-network.samuraijs.com/api/1.1/`,
        withCredentials: true,
    }
)

type TodolistType = {
    id: string
    title: string
    addedDate: Date
    order: number
}

// type ItemTodolistType = {
//     item: TodolistType
// }
//
// type CreateTodolistType = {
//     resultCode: number
//     messages: []
//     data: ItemTodolistType
// }
//
// type DeleteTodolistType = {
//     resultCode: number
//     messages: []
//     data: ItemTodolistType
// }
//
// type PutTodolistType = {
//     title: string
// }

type ResponseType<T = {}> = {
    resultCode: number
    messages: string[]
    data: T
}

export const todolistAPI = {

    getTodolists() {
        return instance.get<TodolistType[]>('todo-lists')
    },

    createTodolist(title: string) {
        return instance.post<ResponseType<{item: TodolistType}>>('todo-lists', title)
    },

    deleteTodolist(todolistId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}`)

    },

    updateTodolist(todolistId: string, title: string) {
        return instance.put<ResponseType>(
            `todo-lists/${todolistId}`,
            {title: title}
        )
    },
}

