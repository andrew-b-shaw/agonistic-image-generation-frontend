'use client'

import React from "react";
import TextEntryField from "../text-entry-field";
import Header from "../header";
import ImageGrid from "../image-grid";
import {theme} from "../theme";

import {ThemeProvider} from "@mui/material";
import LoadingPanel from "@/app/loading-panel";

interface PageState {
    prompt: string
    images: string[]
    imageLoading: boolean
    notesLoading: boolean
}

class Page extends React.Component<{}, PageState> {
    constructor(props: any) {
        super(props);
        this.state = {
            prompt: "",
            images: [],
            imageLoading: false,
            notesLoading: false,
        }
    }

    handlePromptAccept = async (text: string) => {
        await this.handleGenerate(text);
    }

    handleGenerate = async (prompt: string) => {
        this.setState({
            images: [],
            imageLoading: true
        });

        let response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/simple-generate/" + prompt);
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
                <Header title="Simple Interface" info="Instructions Here"/>
                <div className="interface-body" id="simple-interface-body">
                    <TextEntryField
                        placeholder="Enter prompt here..."
                        onAccept={this.handlePromptAccept}
                        tooltip="Generate"
                        sx={{width: 1}}
                    />
                    <div className="image-grid-container">
                        <ImageGrid images={this.state.images} prompt={this.state.prompt}/>
                        <LoadingPanel show={this.state.imageLoading}/>
                    </div>
                </div>
            </ThemeProvider>
        );
    }
}

export default Page;