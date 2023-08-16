import React, { useEffect } from 'react'
import './App.css';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { Menu } from '@mui/icons-material';
import LinearProgress from '@mui/material/LinearProgress';
import { TaskType } from "../api/todolist-api";
import { ErrorSnackbar } from "../components/ErrorSnackbar/ErrorSnackbar";
import { Todolists } from "../features/Todolists";
import { Navigate, Route, Routes } from "react-router-dom";
import { Login } from "../features/Login";
import { useAppDispatch, useAppSelector } from "../state/store";
import { initializeAppTC, RequestStatusType } from "./app-reducer";
import { CircularProgress } from "@mui/material";
import { logoutTC } from "../state/auth-reducer";

export type TasksStateType = {
    [key: string]: Array<TaskType>
}

function App() {
    const status = useAppSelector<RequestStatusType>(state => state.app.status)
    const dispatch = useAppDispatch();
    const isLoggedIn = useAppSelector(state =>
        state.auth.isLoggedIn)

    const isInitialized = useAppSelector(state => state.app.isInitialized)

    useEffect(() => {
        dispatch(initializeAppTC())
    }, [])

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

    const logoutHandler = () => {
        dispatch(logoutTC())
    }

    return (
        <div className="App">

            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    {isLoggedIn && <Button color="inherit" onClick={logoutHandler}>Logout</Button>}
                </Toolbar>
            </AppBar>
            {status === 'loading' && <LinearProgress/>}
            <Container fixed>
                <Routes>
                    <Route path='/' element={<Todolists/>}/>
                    <Route path='/login' element={<Login/>}/>
                    <Route path='/404' element={<h1>404: PAGE NOT FOUND</h1>}/>
                    <Route path='*' element={<Navigate to={'/404'}/>}/>
                </Routes>
            </Container>
            <ErrorSnackbar/>
        </div>
    );
}

export default App;
