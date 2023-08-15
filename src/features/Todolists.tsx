import React, { useCallback, useEffect } from 'react'

import { Todolist } from '../Todolist';
import { AddItemForm } from '../components/AddItemForm/AddItemForm';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

import {
    changeTodolistFilterAC, createTodolistTC, fetchTodolistsTC, FilterValuesType,
    removeTodolistTC, TodolistDomainType, updateTodolistTC
} from '../state/todolists-reducer';
import {
    createTaskTC,
    deleteTaskTC,
    updateTaskStatusTC, updateTaskTitleTC
} from '../state/tasks-reducer';
import { useSelector } from 'react-redux';
import { AppRootStateType, useAppDispatch } from '../state/store';
import { TaskStatuses, TaskType } from "../api/todolist-api";

export type TasksStateType = {
    [key: string]: Array<TaskType>
}

export const Todolists: React.FC = () => {
    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchTodolistsTC())
    }, [])

    const removeTask = useCallback(function (taskId: string, todolistId: string) {
        dispatch(deleteTaskTC(todolistId, taskId))
    }, []);

    const addTask = useCallback(function (title: string, todolistId: string) {
        dispatch(createTaskTC(todolistId, title))
    }, []);

    const changeStatus = useCallback(function (id: string, status: TaskStatuses, todolistId: string) {
        dispatch(updateTaskStatusTC(todolistId, id, status))
    }, []);

    const changeTaskTitle = useCallback(function (taskId: string, newTitle: string, todolistId: string) {
        dispatch(updateTaskTitleTC(todolistId, taskId, newTitle))
    }, []);

    const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
        const action = changeTodolistFilterAC(todolistId, value);
        dispatch(action);
    }, []);

    const removeTodolist = useCallback(function (id: string) {
        dispatch(removeTodolistTC(id))
    }, []);

    const changeTodolistTitle = useCallback(function (id: string, title: string) {
        dispatch(updateTodolistTC(id, title))
    }, []);

    const addTodolist = useCallback((title: string) => {
        dispatch(createTodolistTC(title))
    }, []);
    return <>
        <Grid container style={{padding: '20px'}}>
            <AddItemForm addItem={addTodolist}/>
        </Grid>
        <Grid container spacing={3}>
            {
                todolists.map(tl => {
                    let allTodolistTasks = tasks[tl.id];

                    return <Grid item key={tl.id}>
                        <Paper style={{padding: '10px'}}>
                            <Todolist
                                id={tl.id}
                                title={tl.title}
                                filter={tl.filter}
                                emptyStatus={tl.emptyStatus}
                                tasks={allTodolistTasks}
                                removeTask={removeTask}
                                changeFilter={changeFilter}
                                addTask={addTask}
                                changeTaskStatus={changeStatus}
                                removeTodolist={removeTodolist}
                                changeTaskTitle={changeTaskTitle}
                                changeTodolistTitle={changeTodolistTitle}
                            />
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>
}
