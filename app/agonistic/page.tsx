"use client"

import React from "react";
import Note from "./note";
import Suggestion from "./Suggestion";
import Header from "../header";
import SuggestionsPanel from "./suggestions-panel";
import NotesPanel from "./notes-panel";
import LoadingPanel from "../loading-panel";
import TextEntryField from "../text-entry-field";
import ImageGrid from "../image-grid";
import {theme} from "../theme";
import "./agonistic.css";

import {Button, Collapse, ThemeProvider} from '@mui/material';

interface PageState {
    prompt: string
    notes: {[k: string]: Note} // map of phrase (string) to array of Notes
    suggestions: {[k: string]: Suggestion[]} // map of phrase (string) to array of Suggestions
    focus: string
    images: string[]
    imageLoading: boolean
    notesLoading: string
}

class Page extends React.Component<{}, PageState> {
    constructor(props: any) {
        super(props);
        this.state = {
            prompt: "",
            notes: {},
            suggestions: {},
            focus: "",
            images: [],
            imageLoading: false,
            notesLoading: "",
        }
    }

    handlePromptAccept = async (text: string) => {
        this.setState({
            images: [],
            focus: "",
            notes: {},
            suggestions: {},
            notesLoading: "Interpreting",
            prompt: text
        });

        try {
            let response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/negotiate/" + text);
            if (!response.ok) {
                alert("Error fetching response!");
            }

            let notes: {[k: string]: Note} = {}

            const decoder = new TextDecoder();
            // @ts-ignore
            for await (let chunk of response.body) {
                let chunkDecoded = decoder.decode(chunk, {stream: true});
                console.log(chunkDecoded);
                let chunkJson = JSON.parse(chunkDecoded);
                if (chunkJson['result'] != null) {
                    let suggestions: {[k: string]: Suggestion[]} = chunkJson['result'];
                    for (let phrase in suggestions) {
                        notes[phrase] = {
                            phrase: phrase,
                            annotation: "",
                            disabled: false
                        };
                    }

                    this.setState({
                        notes: notes,
                        suggestions: suggestions,
                        notesLoading: ""
                    });
                } else {
                    this.setState({notesLoading: chunkJson['progress']});
                }
            }
        } catch (e: any) {
            alert("Error fetching response! " + e.toString());
        }
    }

    handleNoteEdit = (phrase: string, annotation: string) => {
        let notes = {...this.state.notes};
        notes[phrase].annotation = annotation;
        this.setState({notes: notes});
    }

    // handleNoteAdd = (phrase: string) => {
    //     if (!Object.hasOwn(this.state.notes, phrase)) {
    //         let notes = {...this.state.notes}
    //         let suggestions = {...this.state.suggestions}
    //
    //         notes[phrase] = {
    //             phrase: phrase,
    //             annotation: "",
    //             disabled: false
    //         };
    //         suggestions[phrase] = [];
    //
    //         this.setState({
    //             notes: notes,
    //             suggestions: suggestions
    //         });
    //     }
    // }

    handleSuggestionAccept = async (text: string) => {
        let notes = {...this.state.notes};
        notes[this.state.focus].annotation = text;
        this.setState({
            notes: notes,
            focus: "",
        })
    }

    handleGenerate = async () => {
        this.setState({
            images: [],
            imageLoading: true
        });

        let formData = new FormData();
        formData.append("prompt", this.state.prompt);
        formData.append("notes", JSON.stringify(this.state.notes));

        let response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/agonistic-generate", {
            method: 'POST',
            body: formData
        });
        if (!response.ok) {
            alert("Error fetching response!");
        }

        let images: string[] = await response.json();
        this.setState({
            images: images,
            imageLoading: false
        });
    }

    // handleIterate = async () => {
    //     let formData = new FormData();
    //     formData.append("prompt", this.state.prompt);
    //     formData.append("notes", JSON.stringify(this.state.notes));
    //
    //     let response = await fetch(BACKEND_URL + "iterate", {
    //         method: 'POST',
    //         body: formData
    //     });
    //
    //     let notes = {...this.state.notes};
    //     let suggestions = {...this.state.suggestions};
    //     for (let phrase in Object.keys(notes)) {
    //         notes[phrase].disabled = true;
    //     }
    //
    //     let new_suggestions: {[k: string]: Suggestion[]} = await response.json();
    //     for (let phrase in new_suggestions) {
    //         if (!Object.hasOwn(this.state.notes, phrase)) {
    //             this.state.notes[phrase] = {
    //                 phrase: phrase,
    //                 annotation: "",
    //                 disabled: false
    //             };
    //             suggestions[phrase] = new_suggestions[phrase];
    //         }
    //     }
    //
    //     this.setState({
    //         notes: {...this.state.notes},
    //         suggestions: {...this.state.suggestions},
    //         notesLoading: false
    //     });
    // }

    render() {
        return (
            <ThemeProvider theme={theme}>
                <Header title="Agonistic Interface" info="Instructions Here"/>
                <div className="interface-body" id="agonistic-interface-body">
                    <div className="prompt-entry">
                        <TextEntryField
                            placeholder="Enter prompt here..."
                            onAccept={this.handlePromptAccept}
                            tooltip="Interpret"
                            sx={{width: '100%'}}
                        />
                    </div>

                    <div id="agonistic-interface-grid">
                        <div id="notes-and-suggestions-grid-item">
                            <div id="notes-and-suggestions-container">
                                <NotesPanel
                                    notes={Object.values(this.state.notes)}
                                    onClick={(phrase) => this.setState({focus: phrase})}
                                    onEdit={this.handleNoteEdit}
                                    loading={this.state.notesLoading}
                                />
                                <Button
                                    variant='contained'
                                    onClick={this.handleGenerate}
                                    disabled={this.state.prompt == ""}
                                    sx={{
                                        position: 'absolute',
                                        bottom: '30px',
                                        left: '50%',
                                        transform: 'translate(-50%, 0)'
                                    }}
                                >
                                    Generate
                                </Button>
                                <Collapse
                                    orientation='horizontal'
                                    in={this.state.focus != ""}
                                    timeout='auto'
                                    sx={{position: 'absolute', top: 0, height: '100%'}}
                                >
                                    <SuggestionsPanel
                                        onClose={() => this.setState({focus: ""})}
                                        phrase={this.state.focus}
                                        suggestions={this.state.focus != "" ? this.state.suggestions[this.state.focus] : []}
                                        onAccept={this.handleSuggestionAccept}
                                    />
                                </Collapse>
                                <LoadingPanel show={this.state.notesLoading != ""} progress={this.state.notesLoading}/>
                            </div>
                        </div>

                        <div id="images-grid-item">
                            <div id="images-container">
                                <ImageGrid images={this.state.images} prompt={this.state.prompt}/>
                                <LoadingPanel show={this.state.imageLoading}/>
                            </div>
                        </div>
                    </div>
                </div>
            </ThemeProvider>
        );
    }
}

export default Page;