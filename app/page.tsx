'use client'

import React, {useEffect, useRef, useState} from "react";
import {ThemeProvider, Button} from "@mui/material";
import {theme} from "./theme";
import {useSearchParams} from "next/navigation";

export default function Page({}) {
    const searchParams = useSearchParams();
    let count = useRef(0);
    let key: string | null = searchParams.get('key');
    let authentication: string = key != null ? "?key=" + key : "";

    const authenticate = async () => {
        try {
            key = prompt("Enter key:");
            let response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/authenticate/" + key);
            if (response.ok) {
                alert("Successfully authenticated!")
                authentication = "?key=" + key;
                location.href = process.env.NEXT_PUBLIC_FRONTEND_PATH + authentication;
            } else {
                alert("Not authenticated!");
            }
        } catch (e: any) {
            alert("Error fetching response! " + e.toString());
        }
    }

    useEffect( () => {
        if (key == null && count.current == 0) {
            count.current = 1;
            authenticate();
        }
    });

    return (
        <ThemeProvider theme={theme}>
            <div style={{position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)"}}>
                <Button href={process.env.NEXT_PUBLIC_FRONTEND_PATH + "/simple" + authentication} size='large'>Interface A</Button>
                <Button href={process.env.NEXT_PUBLIC_FRONTEND_PATH + "/diverse" + authentication} size='large'>Interface B</Button>
                <Button href={process.env.NEXT_PUBLIC_FRONTEND_PATH + "/reformulative" + authentication} size='large'>Interface C</Button>
                <Button href={process.env.NEXT_PUBLIC_FRONTEND_PATH + "/agonistic" + authentication} size='large'>Interface D</Button>
            </div>
        </ThemeProvider>
    );
}