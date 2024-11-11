"use client"

import React, {useRef, useState} from "react";
import Note from "./note";
import Interpretation from "./interpretation";
import Header from "../header";
import InterpretationsPanel from "./interpretations-panel";
import NotesPanel from "./notes-panel";
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
    const [imagePrompt, setimagePrompt] = useState<string>("");
    const [focus, setFocus] = useState<string>("");
    const [notes, setNotes] = useState<{[k: string]: Note}>({});
    const [suggestions, setSuggestions] = useState<{[k: string]: Interpretation[]}>({});
    const [images, setImages] = useState<string[]>([]);
    const [notesLoading, setNotesLoading] = useState<string>("");
    const [imagesLoading, setImagesLoading] = useState<boolean>(false);

    let handlePromptAccept = async (text: string) => {
        let mentalImage: string | null = prompt("Enter your current mental image of the prompt (or press Enter to skip):");

        setimagePrompt(text);
        setFocus("");
        setNotes({});
        setSuggestions({});
        setImages([]);
        setNotesLoading("Interpreting");

        let formData = new FormData();
        formData.append("prompt", text);
        formData.append("key", key != null ? key : "");
        formData.append("mental_image", mentalImage != null ? mentalImage : "");

        try {
            let response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/negotiate", {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                alert("Error fetching response! " + await response.text());
                return;
            }

            let notes: {[k: string]: Note} = {}
            let decoder: TextDecoder = new TextDecoder();
            let fullResponse: string = "";

            // @ts-ignore
            for await (let chunk of response.body) {
                let chunkDecoded: string = decoder.decode(chunk, {stream: true});
                fullResponse += chunkDecoded;
                console.log(fullResponse);

                try {
                    let chunkJson = JSON.parse(fullResponse);
                    if (chunkJson['result'] != null) {
                        let suggestions: {[k: string]: Interpretation[]} = chunkJson['result'];
                        for (let phrase in suggestions) {
                            notes[phrase] = {
                                phrase: phrase,
                                annotation: "",
                                disabled: false
                            };
                        }
                        setNotes(notes);
                        setSuggestions(suggestions);
                    } else {
                        setNotesLoading(chunkJson['progress']);
                    }
                    fullResponse = "";
                } catch (e) {
                    console.log("Waiting for next chunk");
                }
            }
        } catch (e: any) {
            alert("Error fetching response! " + e.toString());
        } finally {
            setNotesLoading("");
        }
    }

    let handleNoteEdit = (phrase: string, annotation: string) => {
        let newNotes = {...notes};
        newNotes[phrase].annotation = annotation;
        setNotes(newNotes);
    }

    let handleSuggestionAccept = async (text: string) => {
        let newNotes = {...notes};
        newNotes[focus].annotation = text;
        setNotes(newNotes);
        setFocus("");
    }

    let handleGenerate = async () => {
        setImages([]);
        setImagesLoading(true);

        let formData = new FormData();
        formData.append("prompt", imagePrompt);
        formData.append("notes", JSON.stringify(notes));
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
                            <NotesPanel
                                notes={Object.values(notes)}
                                onClick={(phrase) => setFocus(phrase)}
                                onEdit={handleNoteEdit}
                                loading={notesLoading}
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
                            <Collapse
                                orientation='horizontal'
                                in={focus != ""}
                                timeout='auto'
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    height: '100%',
                                    maxWidth: "100%",
                                    display: 'block'
                                }}
                            >
                                <InterpretationsPanel
                                    onClose={() => setFocus("")}
                                    phrase={focus}
                                    interpretations={focus != "" ? suggestions[focus] : []}
                                    onAccept={handleSuggestionAccept}
                                />
                            </Collapse>
                            <LoadingPanel show={notesLoading != ""} progress={notesLoading}/>
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