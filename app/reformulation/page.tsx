'use client'

import React, {useState} from "react";
import SuggestionsPanel from "./suggestions-panel";
import TextEntryField from "../text-entry-field";
import Header from "../header";
import ImageGrid from "../image-grid";
import LoadingPanel from "../loading-panel"
import {theme} from "../theme";
import "./reformulation.css"

import {Button, ThemeProvider} from "@mui/material";
import {useSearchParams} from "next/navigation";


export default function Page({}) {
    const searchParams = useSearchParams();
    const key: string | null = searchParams.get('key');
    const [prompt, setPrompt] = useState<string>("");
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [images, setImages] = useState<string[]>([]);
    const [imagesLoading, setImagesLoading] = useState<boolean>(false);
    const [suggestionsLoading, setSuggestionsLoading] = useState<boolean>(false);

    const handlePromptAccept = async (text: string) => {
        setImages([]);
        setPrompt(text);
        setSuggestionsLoading(true);

        try {
            let response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/suggest?" +
                "prompt=" + text +
                "&key=" + key
            );
            if (!response.ok) {
                alert("Error fetching response! " + await response.text());
                return;
            }
            let suggestions: string[] = await response.json();
            setSuggestions(suggestions);
        } catch (e: any) {
            alert("Error fetching response! " + e.toString());
        } finally {
            setSuggestionsLoading(false);
        }
    }

    const handleSuggestionAccept = (text: string) => {
        setPrompt(text);
    }

    const handleGenerate = async () => {
        setImages([]);
        setImagesLoading(true);

        try {
            let response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/simple-generate?" +
                "prompt=" + prompt +
                "&key=" + key
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
                title="Reformulation Interface"
                authenticationKey={key}
                info="
                    Type an image generation prompt into the prompt entry box at the top of the page,
                    then press enter or click the button. The application will generate suggestions
                    to help you reformulate your prompt by adding detail. You can continue to
                    modify these suggestions in the prompt entry box after accepting them. Once you
                    have explored the suggestions, click 'Generate Images' to generate images with your
                    revised prompt.
                "
            />
            <div className="interface-body" id="reformulation-interface-body">
                <TextEntryField
                    placeholder="Enter prompt here..."
                    onChange={(text) =>setPrompt(text)}
                    onAccept={handlePromptAccept}
                    tooltip="Reformulate"
                    value={prompt}
                    sx={{width: 1}}
                    multiline
                />

                <div id="reformulation-interface-grid">
                    <div id="suggestions-grid-item">
                        <div id="suggestions-container">
                            <SuggestionsPanel
                                suggestions={suggestions.length > 0 ? suggestions : []}
                                onAccept={handleSuggestionAccept}
                            />
                            <Button
                                variant='contained'
                                onClick={handleGenerate}
                                disabled={prompt === ""}
                                sx={{
                                    position: 'absolute',
                                    bottom: '30px',
                                    left: '50%',
                                    transform: 'translate(-50%, 0)'
                                }}
                            >
                                Generate Images
                            </Button>
                            <LoadingPanel show={suggestionsLoading}/>
                        </div>
                    </div>

                    <div id="images-grid-item">
                        <div id="images-container">
                            <ImageGrid images={images} prompt={prompt}/>
                            <LoadingPanel show={imagesLoading}/>
                        </div>
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
}