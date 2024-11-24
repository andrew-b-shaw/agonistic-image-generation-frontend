'use client'

import React, {useState} from "react";
import SuggestionsPanel from "./suggestions-panel";
import TextEntryField from "../text-entry-field";
import Header from "../header";
import ImageGrid from "../image-grid";
import LoadingPanel from "../loading-panel"
import {theme} from "../theme";
import "./reformulative.css"

import {Button, Stack, ThemeProvider} from "@mui/material";
import {useSearchParams} from "next/navigation";
import Suggestion from "@/app/reformulative/suggestion";
import PromptWorkspace from "../prompt-workspace";


export default function Page({}) {
    const searchParams = useSearchParams();
    const key: string | null = searchParams.get('key');
    const [reformulationPrompt, setReformulationPrompt] = useState<string>("");
    const [finalPrompt, setFinalPrompt] = useState<string>("");
    const [images, setImages] = useState<string[]>([]);
    const [imagesLoading, setImagesLoading] = useState<boolean>(false);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [suggestionsLoading, setSuggestionsLoading] = useState<boolean>(false);
    const [panelOpen, setPanelOpen] = useState<boolean>(false);

    const handlePromptAccept = async (text: string) => {
        if (reformulationPrompt === "" || confirm("Are you sure you want to reformulate your prompt? To generate images, click the Generate Images button at the bottom of the page.")) {
            setReformulationPrompt(text);
            setImages([]);
            setSuggestions([]);
            setSuggestionsLoading(true);
            setPanelOpen(false);

            try {
                let response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/suggest?" +
                    "prompt=" + text +
                    "&key=" + key
                );
                if (!response.ok) {
                    alert("Error fetching response! " + await response.text());
                    return;
                }
                let suggestions: Suggestion[] = await response.json();
                setSuggestions(suggestions);
            } catch (e: any) {
                alert("Error fetching response! " + e.toString());
            } finally {
                setSuggestionsLoading(false);
            }
        }
    }

    const handleSuggestionAccept = (text: string) => {
        setFinalPrompt(text);
        setPanelOpen(false);
    }

    const handleGenerate = async () => {
        setImages([]);
        setImagesLoading(true);

        try {
            let response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/simple-generate?" +
                "prompt=" + finalPrompt +
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
                title="Interface C"
                authenticationKey={key}
                info="https://docs.google.com/document/d/1MH6uhnPtBZChNb-ecBQPF_JHUKQnz2L0wmBr2QWivms/edit?usp=drive_link"
            />
            <div className="interface-body" id="reformulation-interface-body">
                <Stack direction='row' sx={{position: 'relative'}}>
                    <TextEntryField
                        placeholder="Enter prompt here..."
                        onChange={(text) =>setReformulationPrompt(text)}
                        onAccept={handlePromptAccept}
                        tooltip="Reformulate"
                        sx={{width: 1}}
                        multiline
                    />
                </Stack>

                <div id="reformulation-interface-grid">
                    <div id="suggestions-grid-item">
                        <div id="suggestions-container">
                            <PromptWorkspace
                                prompt={reformulationPrompt}
                                value={finalPrompt}
                                onOpenPanel={() => setPanelOpen(true)}
                                onEdit={(text) => setFinalPrompt(text)}
                                loading={suggestionsLoading}
                            />
                            <SuggestionsPanel
                                open={panelOpen}
                                onClose={() => setPanelOpen(false)}
                                suggestions={suggestions.length > 0 ? suggestions : []}
                                onAccept={handleSuggestionAccept}
                            />
                            <Button
                                variant='contained'
                                onClick={handleGenerate}
                                disabled={reformulationPrompt == ""}
                                sx={{
                                    position: 'absolute',
                                    bottom: '30px',
                                    left: '50%',
                                    transform: 'translate(-50%, 0)'
                                }}
                            >
                                Generate Images
                            </Button>
                            <LoadingPanel show={suggestionsLoading} progress="Reformulating"/>
                        </div>
                    </div>

                    <div id="images-grid-item">
                        <div id="images-container">
                            <ImageGrid images={images} prompt={reformulationPrompt}/>
                            <LoadingPanel show={imagesLoading}/>
                        </div>
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
}