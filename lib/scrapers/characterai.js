import { CharacterAI } from "node_characterai";

const token = process.env.CAI_TOKEN;

if (!token) {
    throw new Error("CAI_TOKEN environment variable is not set");
}

const characterAI = new CharacterAI();

if (!global.temporary) global.temporary = {};

let isAuthenticated = global.temporary.isAuthenticated || false;

/**
 * Authenticates to the CharacterAI API using the provided token
 *
 * @private
 * @function
 * @returns {Promise<void>}
 */
async function authenticate() {
    if (!isAuthenticated) {
        await characterAI.authenticate(token);
        global.temporary.isAuthenticated = true;
        isAuthenticated = true;
    }
}

/**
 * Searches for characters in the CharacterAI database
 *
 * @param {string} query - Search query
 * @returns {Promise<Character[]>} - An array of characters that match the query, limited to 25 items
 * @throws {Error} - If the search operation fails
 */
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

/**
 * Starts a new chat session with the given character ID
 *
 * @param {string} characterId - ID of the character to start a chat session with
 * @returns {Promise<DM>} - The DM object that can be used to send messages to the character
 * @throws {Error} - If the operation fails
 */
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

/**
 * Sends a message to a character in the chat session.
 *
 * @param {Object} chatSession - The chat session object for the character.
 * @param {string} message - The message to be sent to the character.
 * @returns {Promise<string>} - The content of the message sent.
 * @throws {Error} - If sending the message fails.
 */
export async function sendMessage(chatSession, message) {
    try {
        const result = await chatSession.sendMessage(message);
        return result.content;
    } catch (error) {
        console.error("Error sending message:", error);
        throw new Error("Failed to send message");
    }
}