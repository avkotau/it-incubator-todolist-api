import { TacksActionsType, tasksReducer } from './tasks-reducer';
import { TodolistsActionsType, todolistsReducer } from './todolists-reducer';
import { applyMiddleware, combineReducers, legacy_createStore as createStore } from 'redux';
import thunk, { ThunkDispatch } from "redux-thunk";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { appReducer, AppReducerActionsType } from "../app/app-reducer";

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer
})
// непосредственно создаём store
export const store = createStore(rootReducer, applyMiddleware(thunk));

// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof rootReducer>

//типизаци actions
type AppActionsType = TodolistsActionsType | TacksActionsType | AppReducerActionsType
//типизаци dispatch
type AppDispatchType = ThunkDispatch<AppRootStateType, any, AppActionsType>

//типизированный hook useDispatch
export const useAppDispatch = () => useDispatch<AppDispatchType>()

//типизированный hook useSelector
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;
