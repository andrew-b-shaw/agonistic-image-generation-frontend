'use client'

import React from 'react';
import TextEntryField from '../text-entry-field';
import Header from '@/app/header';
import ImageGrid from '@/app/image-grid';
import {theme} from '../theme';

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

        try {
            let response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/diverse-generate/" + prompt);
            if (!response.ok) {
                alert("Error fetching response! " + await response.text());
                return;
            }
            let images: string[] = await response.json();
            this.setState({images: images});
        } catch (e: any) {
            alert("Error fetching response! " + e.toString());
        } finally {
            this.setState({imageLoading: false});
        }
    }

    render() {
        return (
            <ThemeProvider theme={theme}>
                <Header title="Diverse Interface" info="
                    Type an image generation prompt into the prompt entry box at the top of the page,
                    then press enter or click the button to generate images. The application will
                    automatically diversify your prompt after you submit it.
                "/>
                <div className="interface-body" id="diverse-interface-body">
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