'use client'

import React, {useEffect, useRef, useState} from "react";
import {ThemeProvider, Button} from "@mui/material";
import {theme} from "./theme";
import {useSearchParams} from "next/navigation";

export default function Page({}) {
    const searchParams = useSearchParams();
    const [authentication, setAuthentication] = useState("");
    let count = useRef(0);

    useEffect(() => {
        const authenticate = async () => {
            let key: string | null = searchParams.get('key');
            try {
                if (key != null) {
                    setAuthentication("?key=" + key);
                } else {
                    key = prompt("Enter Key:");
                    let response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/authenticate/" + key);
                    if (response.ok) {
                        alert("Successfully authenticated!")
                        setAuthentication("?key=" + key);
                    } else {
                        alert("Not authenticated!");
                    }
                }
            } catch (e: any) {
                alert ("Error fetching response! " + e.toString());
            }
        }

        if (count.current == 0) {
            count.current = 1;
            authenticate();
        }
    })

    return (
        <ThemeProvider theme={theme}>
            <div style={{position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)"}}>
                <Button href={process.env.NEXT_PUBLIC_FRONTEND_PATH + "/simple" + authentication}>Simple</Button>
                <Button href={process.env.NEXT_PUBLIC_FRONTEND_PATH + "/diverse" + authentication}>Diverse</Button>
                <Button href={process.env.NEXT_PUBLIC_FRONTEND_PATH + "/agonistic" + authentication}>Agonistic</Button>
                <Button href={process.env.NEXT_PUBLIC_FRONTEND_PATH + "/reformulation" + authentication}>Reformulation</Button>
            </div>
        </ThemeProvider>
    );
}