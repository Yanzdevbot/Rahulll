import { CharacterAI } from "node_characterai";

const token = process.env.CAI_TOKEN;

if (!token) {
    throw new Error("CAI_TOKEN environment variable is not set");
}
const client = new CharacterAI(token);

export async function searchCharacter(query) {
    try {
        await client.authenticate(token);
        const { characters } = await client.searchCharacter(query);
        return characters.slice(0, 25);
    } catch (error) {
        console.error("Error searching for characters:", error);
        throw error;
    }
}

export async function sendMessage(characterId, message) {
    try {
        await client.authenticate(token);
        const character = await client.fetchCharacter(characterId);
        let chat;

        try {
            chat = await character.DM();
        } catch {
            chat = await character.createDM();
        }

        const result = await chat.sendMessage(message);
        return result;
    } catch (error) {
        console.error("Error sending message:", error);
        throw error;
    }
}