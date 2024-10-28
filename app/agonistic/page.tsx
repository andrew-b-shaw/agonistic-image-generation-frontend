"use client"

import React, {useState} from "react";
import Note from "./note";
import Suggestion from "./suggestion";
import Header from "../header";
import SuggestionsPanel from "./suggestions-panel";
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
    const [prompt, setPrompt] = useState<string>("");
    const [focus, setFocus] = useState<string>("");
    const [notes, setNotes] = useState<{[k: string]: Note}>({});
    const [suggestions, setSuggestions] = useState<{[k: string]: Suggestion[]}>({});
    const [images, setImages] = useState<string[]>([]);
    const [notesLoading, setNotesLoading] = useState<string>("");
    const [imagesLoading, setImagesLoading] = useState<boolean>(false);

    let handlePromptAccept = async (text: string) => {
        setPrompt(text);
        setFocus("");
        setNotes({});
        setSuggestions({});
        setImages([]);
        setNotesLoading("Interpreting");

        try {
            let response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/negotiate?" +
                "prompt=" + text +
                "&key=" + key
            );

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
                        let suggestions: {[k: string]: Suggestion[]} = chunkJson['result'];
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
        formData.append("prompt", prompt);
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
                info="
                    Type an image generation prompt into the prompt entry box at the top of the page,
                    then press enter or click the button. The application will research the prompt using
                    Wikipedia and generate possible interpreations of subjects in your prompt in the
                    'Detected Subjects' section. You can explore these interpretations and their
                    associated Wikipedia sources below, and modify them after clicking 'Accept.' After
                    exploring interpretations, click 'Generate Images' to generate images with your
                    revised prompt.
                "
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
                                disabled={prompt == ""}
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
                                sx={{position: 'absolute', top: 0, height: '100%'}}
                            >
                                <SuggestionsPanel
                                    onClose={() => setFocus("")}
                                    phrase={focus}
                                    suggestions={focus != "" ? suggestions[focus] : []}
                                    onAccept={handleSuggestionAccept}
                                />
                            </Collapse>
                            <LoadingPanel show={notesLoading != ""} progress={notesLoading}/>
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