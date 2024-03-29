import React, { ChangeEvent, useState } from 'react';
import TextField from '@mui/material/TextField';

type EditableSpanPropsType = {
    value: string
    onChange: (newValue: string) => void
    disabled: boolean
}

export const EditableSpan = React.memo(function (props: EditableSpanPropsType) {

    let [editMode, setEditMode] = useState(false);
    let [title, setTitle] = useState(props.value);

    const activateEditMode = () => {
        setEditMode(!props.disabled);
        setTitle(props.value);
    }
    const activateViewMode = () => {
        setEditMode(false);
        props.onChange(title);
    }
    const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    return editMode
        ? <TextField value={title} onChange={changeTitle} autoFocus onBlur={activateViewMode}
                     disabled={props.disabled}/>
        : <span style={props.disabled ? {pointerEvents: "none", opacity: 0.4} : {}}
                onDoubleClick={activateEditMode}>{props.value}</span>
});
