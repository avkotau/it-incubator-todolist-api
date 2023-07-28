import { TacksActionsType, tasksReducer } from './tasks-reducer';
import { TodolistsActionsType, todolistsReducer } from './todolists-reducer';
import { applyMiddleware, combineReducers, legacy_createStore as createStore } from 'redux';
import thunk, { ThunkDispatch } from "redux-thunk";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { appReducer, AppReducerActionsType } from "../app/app-reducer";

// unite reducers with help combineReducers,
// create structure our app ones object single state-object
const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer
})
// create store
export const store = createStore(rootReducer, applyMiddleware(thunk));

// detect automatically type all state-object
export type AppRootStateType = ReturnType<typeof rootReducer>

//type actions
type AppActionsType = TodolistsActionsType | TacksActionsType | AppReducerActionsType
//type dispatch
type AppDispatchType = ThunkDispatch<AppRootStateType, any, AppActionsType>

//type hook useDispatch
export const useAppDispatch = () => useDispatch<AppDispatchType>()

//type hook useSelector
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector

// so that you can access the store in the browser console at any time
// @ts-ignore
window.store = store;
