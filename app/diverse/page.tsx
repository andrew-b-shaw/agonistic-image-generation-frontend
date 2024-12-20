'use client'

import React, {useState} from 'react';
import TextEntryField from '../text-entry-field';
import Header from '../header';
import ImageGrid from '../image-grid';
import LoadingPanel from "../loading-panel";
import {theme} from '../theme';
import {ThemeProvider} from "@mui/material";
import {useSearchParams} from "next/navigation";


export default function Page({}) {
    const searchParams = useSearchParams();
    const key: string | null = searchParams.get('key');
    const [prompt, setPrompt] = useState<string>("");
    const [images, setImages] = useState<string[]>([]);
    const [imagesLoading, setImagesLoading] = useState<boolean>(false);

    const handleGenerate = async (text: string) => {
        setImages([]);
        setImagesLoading(true);
        setPrompt(text);

        try {
            let response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/diverse-generate?" +
                "prompt=" + text +
                "&key=" + searchParams.get('key')
            );
            if (!response.ok) {
                alert("Error fetching response! " + await response.text());
                return;
            }
            let images: string[] = await response.json();
            setImages(images);
        } catch (e: any) {
            alert("Error fetching response! " + e.toString());
        } finally {
            setImagesLoading(false);
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <Header
                title="Interface B"
                authenticationKey={key}
                info="https://docs.google.com/document/d/1SUolKv9mZfkSpp9gDjBgpipmz8M8FceDTVpyYtsItlA/edit?usp=drive_link"
            />
            <div className="interface-body" id="diverse-interface-body">
                <TextEntryField
                    placeholder="Enter prompt here..."
                    onAccept={handleGenerate}
                    tooltip="Generate"
                    sx={{width: 1}}
                />
                <div className="image-grid-container">
                    <ImageGrid images={images} prompt={prompt}/>
                    <LoadingPanel show={imagesLoading}/>
                </div>
            </div>
        </ThemeProvider>
    );
}