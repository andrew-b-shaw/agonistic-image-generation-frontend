"use client"

import React, {useRef, useState} from "react";
import Note from "./note";
import Interpretation from "./interpretation";
import Header from "../header";
import InterpretationsPanel from "./interpretations-panel";
import PromptWorkspace from "../prompt-workspace";
import LoadingPanel from "../loading-panel";
import TextEntryField from "../text-entry-field";
import ImageGrid from "../image-grid";
import {theme} from "../theme";
import "./agonistic.css";

import {Button, Collapse, ThemeProvider} from '@mui/material';
import {useSearchParams} from "next/navigation";


export default function Page({}) {
    const searchParams = useSearchParams();
    const key: string | null = searchParams.get('key');
    const [imagePrompt, setImagePrompt] = useState<string>("");
    const [annotation, setAnnotation] = useState<string>("");
    const [interpretations, setInterpretations] = useState<Interpretation[]>([]);
    const [interpretationsLoading, setInterpretationsLoading] = useState<string>("");
    const [images, setImages] = useState<string[]>([]);
    const [imagesLoading, setImagesLoading] = useState<boolean>(false);
    const [panelOpen, setPanelOpen] = useState<boolean>(false);

    let handlePromptAccept = async (text: string) => {
        if (imagePrompt === "" || confirm("Are you sure you want to reinterpret your prompt? To generate images, explore possible interpretations of your prompt and click the Generate Images button at the bottom of the page.")) {
            setImagePrompt(text);
            setAnnotation("");
            setInterpretations([]);
            setInterpretationsLoading("Interpreting");
            setImages([]);
            setPanelOpen(false);

            let formData = new FormData();
            formData.append("prompt", text);
            formData.append("key", key != null ? key : "");

            try {
                let response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/negotiate", {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    alert("Error fetching response! " + await response.text());
                    return;
                }

                let decoder: TextDecoder = new TextDecoder();
                let fullResponse: string = "";

                // @ts-ignore
                for await (const chunk of response.body) {
                    let chunkDecoded: string = decoder.decode(chunk, {stream: true});
                    fullResponse += chunkDecoded;
                    console.log(fullResponse);

                    try {
                        let chunkJson = JSON.parse(fullResponse);
                        if (chunkJson['result'] != null) {
                            let interpretations: Interpretation[] = chunkJson['result'];
                            setInterpretations(interpretations);
                            setPanelOpen(true);
                        } else {
                            setInterpretationsLoading(chunkJson['progress']);
                        }
                        fullResponse = "";
                    } catch (e) {
                        console.log("Waiting for next chunk");
                    }
                }
            } catch (e: any) {
                alert("Error fetching response! " + e.toString());
            } finally {
                setInterpretationsLoading("");
            }
        }
    }

    let handleSuggestionAccept = async (description: string, source: string) => {
        setAnnotation(description + " (" + source + ")");
        setPanelOpen(false);
    }

    let handleGenerate = async () => {
        setImages([]);
        setImagesLoading(true);

        let formData = new FormData();
        formData.append("prompt", annotation);
        formData.append("key", key != null ? key : "");

        try {
            let response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/agonistic-generate", {
                method: 'POST',
                body: formData
            });
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
                title="Interface D"
                authenticationKey={key}
                info="https://docs.google.com/document/d/1wGV7vjCpFByhxa4fhYFYrJHK9V6k33iwILpjY-1Zqss/edit?usp=drive_link"
            />
            <div className="interface-body" id="agonistic-interface-body">
                <div className="prompt-entry">
                    <TextEntryField
                        placeholder="Enter prompt here..."
                        onAccept={handlePromptAccept}
                        tooltip="Interpret"
                        sx={{width: '100%'}}
                    />
                </div>

                <div id="agonistic-interface-grid">
                    <div id="notes-and-suggestions-grid-item">
                        <div id="notes-and-suggestions-container">
                            <PromptWorkspace
                                prompt={imagePrompt}
                                value={annotation}
                                onEdit={(text) => setAnnotation(text)}
                                onOpenPanel={() => setPanelOpen(true)}
                                label="See possible interpretations"
                                loading={interpretationsLoading != ""}
                            />
                            <Button
                                variant='contained'
                                onClick={handleGenerate}
                                disabled={imagePrompt == ""}
                                sx={{
                                    position: 'absolute',
                                    bottom: '30px',
                                    left: '50%',
                                    transform: 'translate(-50%, 0)'
                                }}
                            >
                                Generate Images
                            </Button>
                            <InterpretationsPanel
                                open={panelOpen}
                                onClose={() => setPanelOpen(false)}
                                interpretations={interpretations}
                                onAccept={handleSuggestionAccept}
                            />
                            <LoadingPanel show={interpretationsLoading != ""} progress={interpretationsLoading}/>
                        </div>
                    </div>

                    <div id="images-grid-item">
                        <div id="images-container">
                            <ImageGrid images={images} prompt={imagePrompt}/>
                            <LoadingPanel show={imagesLoading}/>
                        </div>
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
}