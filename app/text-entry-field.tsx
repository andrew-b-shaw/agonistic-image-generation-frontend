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
    multiline?: boolean
}

export default function TextEntryField(props: TextEntryFieldProps) {
    const [text, setText] = React.useState("");

    const handleChange = (event: any) => {
        let input: string = event.target.value;
        if (input.charAt(input.length - 1) === '\n') {
            // handle adding new line after pressing enter (multiline case)
            input = input.substring(0, input.length - 1);
        }

        setText(input);
        if (props.onChange) {
            props.onChange(input);
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
                value={props.value ? props.value : text}  // need to add text here to handle multiline case in handleChange function
                sx={props.sx}
                multiline={props.multiline ? true : undefined}
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