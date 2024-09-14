'use client'

import React from "react";
import {FormControl, IconButton, InputAdornment, OutlinedInput,Tooltip} from "@mui/material";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

interface TextEntryFieldProps {
    placeholder: string
    tooltip: string
    onAccept: (text: string) => any
    onChange?: (text: string) => any
    value?: string
    sx?: any
}

export default function TextEntryField(props: TextEntryFieldProps) {
    const [text, setText] = React.useState("");

    const handleChange = (event: any) => {
        setText(event.target.value);
        if (props.onChange) {
            props.onChange(event.target.value);
        }
    }

    return (
        <FormControl sx={props.sx} variant="outlined">
            <OutlinedInput
                onChange={handleChange}
                onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                        props.onAccept(text)
                    }
                }}
                placeholder={props.placeholder}
                value={props.value}
                sx={props.sx}
                endAdornment={
                    <InputAdornment position="end">
                        <Tooltip title={props.tooltip ? props.tooltip : "Next"}>
                            <IconButton
                                onClick={() => props.onAccept(text)}
                                edge="end"
                            >
                                <KeyboardDoubleArrowRightIcon/>
                            </IconButton>
                        </Tooltip>
                    </InputAdornment>
                }
            />
        </FormControl>
    );
}