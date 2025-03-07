import { writeFileSync, readFileSync, existsSync } from "fs";
import { CohereClient } from "cohere-ai";

const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY,
});

const DB_FILE = "notes.json";

type Note = {
    id: number
    content: string
};
type NotesDB = Note[];

const loadNotes = (): NotesDB => {
    if (!existsSync(DB_FILE)) return [];
    return JSON.parse(readFileSync(DB_FILE, "utf8"));
};

const saveNotes = (notes: NotesDB) => {
    writeFileSync(DB_FILE, JSON.stringify(notes, null, 2));
};

const prompt_cohere = async (prompt: string, model: string = "command-r-plus-08-2024"): Promise<string> => {
    var response = await cohere.chat({
        model: model,
        message: prompt,
    });
    return response.text;
};

const [command, ...args] = process.argv.slice(2);
const notes = loadNotes();

switch (command) {
    case "add":
        const content = args.join(" ");
        if (!content) {
            console.log("Usage: bun dev add <note content>");
            break;
        }
        notes.push({ id: Date.now(), content });
        saveNotes(notes);
        console.log("Note added!");
        break;
    case "list":
        console.log("Notes:");
        notes.forEach((note) => console.log(`- ${note.content}`));
        break;
    case "delete":
        const idToDelete = Number(args[0]);
        const filteredNotes = notes.filter((note) => note.id !== idToDelete);
        saveNotes(filteredNotes);
        console.log("Note deleted!");
        break;
    case "prompt":
        const prompt = args.join(" ");
        if (!prompt) {
            console.log("Usage: bun dev prompt <prompt>");
            break;
        }
        var response = await prompt_cohere(prompt);
        console.log(response);
        break;
    default:
        console.log("Commands: add, list, delete");
}
