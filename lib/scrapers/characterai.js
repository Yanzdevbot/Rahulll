import { CharacterAI } from "node_characterai";

const token = process.env.CAI_TOKEN;

if (!token) {
    throw new Error("CAI_TOKEN environment variable is not set");
}
const client = new CharacterAI(token);
const isStart = false;

if (isStart) {
    await client.authenticate(token).then(() => {
        console.log("CharacterAI client authenticated successfully");
        isStart = true;
    });
}

export async function searchCharacter(query) {
    try {
        const { characters } = await client.searchCharacter(query);
        return characters.slice(0, 20);
    } catch (error) {
        console.error("Error fetching character:", error);
        throw error;
    }
}

export async function sendMessage(characterId, message) {
    try {
        const character = await client.fetchCharacter(characterId);
        if (!character) {
            throw new Error("Character not found");
        }
        let chat;
        try {
            chat = await character.DM();
        } catch {
            chat = await character.createDM();
        }
        const response = await chat.sendMessage(message);
        return response.content;
    } catch (error) {
        console.error("Error sending message:", error);
        throw error;
    }
}