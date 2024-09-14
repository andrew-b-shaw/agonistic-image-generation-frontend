'use client'

import React from "react";
import {ThemeProvider, Button} from "@mui/material";
import {theme} from "./theme";

export default function Page() {
    return (
        <ThemeProvider theme={theme}>
            <div style={{position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)"}}>
                <Button href={process.env.NEXT_PUBLIC_FRONTEND_PATH + "/simple"}>Simple</Button>
                <Button href={process.env.NEXT_PUBLIC_FRONTEND_PATH + "/diverse"}>Diverse</Button>
                <Button href={process.env.NEXT_PUBLIC_FRONTEND_PATH + "/agonistic"}>Agonistic</Button>
                <Button href={process.env.NEXT_PUBLIC_FRONTEND_PATH + "/reformulation"}>Reformulation</Button>
            </div>
        </ThemeProvider>
    );
}