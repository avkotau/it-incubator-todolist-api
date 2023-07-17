import React, { useEffect, useState } from 'react'
import { taskAPI } from "../api/task-api";

export default {
    title: 'API'
}

export const GetTasks = () => {
    const [state, setState] = useState<any>(null)

    useEffect(() => {
        // здесь мы будем делать запрос и ответ закидывать в стейт.
        // который в виде строки будем отображать в div-ке

        const todolistId = '3b0304fc-63df-4ddb-801a-f44264e6222e'
        taskAPI.getTasks(todolistId)
            .then((res) => {
                console.log(res.data)
                setState(res.data)
            })
    }, [])
    return <div>{JSON.stringify(state)}</div>
}
export const CreateTask = () => {
    const [state, setState] = useState<any>(null)

    useEffect(() => {
        const Title = 'WWWWWWWWWWWWWW'
        const todolistId = '3b0304fc-63df-4ddb-801a-f44264e6222e'
        taskAPI.createTask(todolistId, Title)

            .then((res) => {

                setState(res.data)
            })


    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const DeleteTask = () => {
    const [state, setState] = useState<any>(null)

    useEffect(() => {
        const todolistId = '3b0304fc-63df-4ddb-801a-f44264e6222e'
        const taskId = 'dfbdd947-7845-4f63-a221-e8747bb4e0ed'
        taskAPI.deleteTask(todolistId, taskId)
            .then((res) => {

                setState(res.data)
            }).catch(err => err)
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const UpdateTaskTitle = () => {
    const [state, setState] = useState<any>(null)

    useEffect(() => {
        const todolistId = '3b0304fc-63df-4ddb-801a-f44264e6222e'
        const taskId = '893beaef-8b35-462a-abea-5190cb1f85ee'
        const title = 'JS'
        taskAPI.updateTask(todolistId, taskId, title)
            .then((res) => {
                setState(res.data)
            })

    }, [])

    return <div>{JSON.stringify(state)}</div>
}

