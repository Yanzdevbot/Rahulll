import { CharacterAI } from "node_characterai";

const token = process.env.CAI_TOKEN;

if (!token) {
    throw new Error("CAI_TOKEN environment variable is not set");
}
const client = new CharacterAI(token);

export async function searchCharacter(query) {
    let results = [];
    try {
        client.authenticate(token).then(async () => {
            const { characters } = await client.searchCharacters(query);
            results = characters.slice(0, 25);
        })
    } catch (error) {
        console.error("Error searching for characters:", error);
        throw error;
    }
    return results;
}

export async function sendMessage(characterId, message) {
    let result;
    try {
        client.authenticate(token).then(async () => {
            const character = await client.fetchCharacter(characterId);
            let chat;
            try {
                chat = await character.DM();
            } catch {
                chat = await character.createDM();
            }
            result = await chat.sendMessage(message);
        });
    } catch (error) {
        console.error("Error sending message:", error);
        throw error;
    }
}