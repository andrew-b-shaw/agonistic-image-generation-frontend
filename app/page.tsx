'use client'

import React from "react";
import {ThemeProvider, Button} from "@mui/material";
import {theme} from "./theme";

export default function Page() {
    return (
        <ThemeProvider theme={theme}>
            <div style={{position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)"}}>
                <Button href={"/simple"}>Simple</Button>
                <Button href={"/diverse"}>Diverse</Button>
                <Button href={"/agonistic"}>Agonistic</Button>
                <Button href={"/reformulation"}>Reformulation</Button>
            </div>
        </ThemeProvider>
    );
}