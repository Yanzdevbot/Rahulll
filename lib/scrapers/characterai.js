import { CharacterAI } from "node_characterai";

const token = process.env.CAI_TOKEN;

if (!token) {
    throw new Error("CAI_TOKEN environment variable is not set");
}

const characterAI = new CharacterAI();

// Initialize authentication once and reuse
let isAuthenticated = false;

async function authenticate() {
    if (!isAuthenticated) {
        await characterAI.authenticate(token);
        isAuthenticated = true;
    }
}

export async function searchCharacter(query) {
    try {
        await authenticate();
        const { characters } = await characterAI.searchCharacter(query);
        return characters.slice(0, 25);
    } catch (error) {
        console.error("Error searching for characters:", error);
        throw new Error("Failed to search characters");
    }
}

export async function startChatSession(characterId) {
    try {
        await authenticate();
        const character = await characterAI.fetchCharacter(characterId);
        
        try {
            return await character.DM();
        } catch {
            return await character.createDM();
        }
    } catch (error) {
        console.error("Error starting chat session:", error);
        throw new Error("Failed to start chat session");
    }
}

export async function sendMessage(chatSession, message) {
    try {
        const result = await chatSession.sendMessage(message);
        return result.content;
    } catch (error) {
        console.error("Error sending message:", error);
        throw new Error("Failed to send message");
    }
}
