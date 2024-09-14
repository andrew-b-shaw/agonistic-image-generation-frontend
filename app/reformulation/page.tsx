'use client'

import React from "react";
import SuggestionsPanel from "./suggestions-panel";
import TextEntryField from "../text-entry-field";
import Header from "../header";
import ImageGrid from "../image-grid";
import LoadingPanel from "../loading-panel"
import {theme} from "../theme";
import "./reformulation.css"

import {Button, ThemeProvider} from "@mui/material";

interface AppState {
    prompt: string
    finalPrompt: string
    suggestions: string[]
    images: string[]
    imageLoading: boolean
    suggestionsLoading: boolean
}

class Page extends React.Component<{}, AppState> {
    constructor(props: any) {
        super(props);
        this.state = {
            prompt: "",
            finalPrompt: "",
            suggestions: [],
            images: [],
            imageLoading: false,
            suggestionsLoading: false,
        }
    }

    handlePromptAccept = async (text: string) => {
        this.setState({
            images: [],
            prompt: text,
            suggestionsLoading: true
        });

        let response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/suggest/" + text);
        if (!response.ok) {
            alert("Error fetching response!");
        }

        let suggestions: string[] = await response.json();

        this.setState({
            suggestions: suggestions,
            suggestionsLoading: false
        });
    }

    handleSuggestionAccept = (suggestion: string) => {
        this.setState({
            prompt: suggestion
        });
    }

    handleGenerate = async () => {
        this.setState({
            images: [],
            imageLoading: true
        });

        let response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/simple-generate/" + this.state.prompt);
        if (!response.ok) {
            alert("Error fetching response!");
        }

        let images: string[] = await response.json();
        this.setState({
            images: images,
            imageLoading: false
        });
    }

    render() {
        return (
            <ThemeProvider theme={theme}>
                <Header title="Reformulation Interface" info="Instructions Here"/>
                <div className="interface-body" id="reformulation-interface-body">
                    <TextEntryField
                        placeholder="Enter prompt here..."
                        onChange={(text) => this.setState({prompt: text})}
                        onAccept={this.handlePromptAccept}
                        tooltip="Reformulate"
                        value={this.state.prompt}
                        sx={{width: 1}}
                    />

                    <div id="reformulation-interface-grid">
                        <div id="suggestions-grid-item">
                            <div id="suggestions-container">
                                <SuggestionsPanel
                                    suggestions={this.state.suggestions.length > 0 ? this.state.suggestions : []}
                                    onAccept={this.handleSuggestionAccept}
                                />
                                <Button
                                    variant='contained'
                                    onClick={this.handleGenerate}
                                    disabled={this.state.prompt === ""}
                                    sx={{
                                        position: 'absolute',
                                        bottom: '30px',
                                        left: '50%',
                                        transform: 'translate(-50%, 0)'
                                    }}
                                >
                                    Generate
                                </Button>
                                <LoadingPanel show={this.state.suggestionsLoading}/>
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