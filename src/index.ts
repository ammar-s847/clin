import { writeFileSync, readFileSync, existsSync } from "fs";

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

const [command, ...args] = process.argv.slice(2);
const notes = loadNotes();

switch (command) {
    case "add":
        const content = args.join(" ");
        if (!content) {
            console.log("Usage: bun run index.ts add <note content>");
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
    default:
        console.log("Commands: add, list, delete");
}
