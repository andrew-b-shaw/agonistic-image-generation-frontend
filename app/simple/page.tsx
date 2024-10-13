'use client'

import React, {useState} from "react";
import TextEntryField from "../text-entry-field";
import Header from "../header";
import ImageGrid from "../image-grid";
import {theme} from "../theme";

import {ThemeProvider} from "@mui/material";
import LoadingPanel from "@/app/loading-panel";
import {useSearchParams} from "next/navigation";

export default function Page({}) {
    const searchParams = useSearchParams();
    const key: string | null = searchParams.get('key');
    const [prompt, setPrompt] = useState<string>("");
    const [images, setImages] = useState<string[]>([]);
    const [imagesLoading, setImagesLoading] = useState<boolean>(false);

    const handlePromptAccept = async (text: string) => {
        await handleGenerate(text);
    }

    const handleGenerate = async (text: string) => {
        setImages([]);
        setImagesLoading(true);
        setPrompt(text);

        try {
            let response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/simple-generate?" +
                "prompt=" + text +
                "&key=" + key
            );
            if (!response.ok) {
                alert("Error fetching response! " + await response.text());
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
                title="Simple Interface"
                authenticationKey={key}
                info="
                    Type an image generation prompt into the prompt entry box at the top of the page,
                    then press enter or click the button to generate images.
                "
            />
            <div className="interface-body" id="simple-interface-body">
                <TextEntryField
                    placeholder="Enter prompt here..."
                    onAccept={handlePromptAccept}
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