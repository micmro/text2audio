#!/usr/bin/env node

const fs = require('fs')
const request = require('request')
const sanitize = require("sanitize-filename")
const commandLineArgs = require('command-line-args')
const getUsage = require('command-line-usage')

const optionDefinitions = [
    { name: 'lang', alias: 'l', type: String, default: "en", description: "Language of the word/text in ISO e.g. en-US or ko-KR (default is en)" },
    { name: 'words', type: String, typeLabel: '[underline]{word or words}', multiple: true, defaultOption: true, description: "Word(s) to change to audio" },
    { name: "help", alias: 'h' },
]
const sections = [
    {
        header: 'text2audio',
        content: 'Generates an mp3 from text input and saves it in the current path'
    },
    {
        header: 'Usage',
        content: `text2audio Hello there -l en
text2audio 안녕하세요 -l ko-KR`
    },
    {
        header: 'Options',
        optionList: optionDefinitions
    }
]

const options = commandLineArgs(optionDefinitions)

if (options.help !== undefined) {
    console.log(getUsage(sections))
    return;
}

const language = options.lang || "en-US"
const textToTranslate = options.words.join(" ");
const fileName = `${sanitize(textToTranslate)}.mp3`
const requestOptions = {
    url: `http://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(textToTranslate)}&tl=${language}&client=tw-ob`,
    headers: {
        'Referer': 'http://translate.google.com/',
        'User-Agent': 'stagefright/1.2 (Linux;Android 5.0)'
    }
}

// for debugging
// console.log(requestOptions, fileName)

request(requestOptions)
    .pipe(fs.createWriteStream(fileName))

console.log(`Saved as ${fileName}`)
