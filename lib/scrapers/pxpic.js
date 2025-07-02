import { fileTypeFromBuffer } from "file-type"
import axios from "axios"
import qs from "qs"

class Pxpic {
    constructor() {
        this.tools = ["removebg", "enhance", "upscale", "restore", "colorize"];
        this.cdnDomain = "https://files.fotoenhancer.com/uploads/";
    }

    /**
     * Upload a buffer to pxpic
     * @param {Buffer} buffer the buffer to upload
     * @return {Promise<string>} the url of the uploaded image
     */
    async upload(buffer) {
        const { ext, mime } = await fileTypeFromBuffer(buffer) || {};
        const fileName = `${Date.now()}.${ext}`;
        const folder = "uploads";

        const response = await axios.post("https://pxpic.com/getSignedUrl", { folder, fileName }, {
            headers: { "Content-Type": "application/json" }
        });

        const { presignedUrl } = response.data;
        await axios.put(presignedUrl, buffer, { headers: { "Content-Type": mime } });

        return this.cdnDomain + fileName;
    }

    /**
     * Create a new image using pxpic tools
     * @param {Buffer} buffer the buffer of the image
     * @param {string} tools the tool to use, must be one of: removebg, enhance, upscale, restore, colorize
     * @return {Promise<string>} the url of the processed image
     * @throws {Error} if the tool is not valid
     */
    async create(buffer, tools) {
        if (!this.tools.includes(tools)) {
            throw new Error(`Pilih salah satu dari tools ini: ${this.tools.join(", ")}`);
        }

        const url = await this.upload(buffer);
        const data = qs.stringify({
            imageUrl: url,
            targetFormat: "png",
            needCompress: "no",
            imageQuality: "100",
            compressLevel: "6",
            fileOriginalExtension: "png",
            aiFunction: tools,
            upscalingLevel: "",
        });

        const config = {
            method: "POST",
            url: "https://pxpic.com/callAiFunction",
            headers: {
                "User-Agent": "Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/png,image/svg+xml,*/*;q=0.8",
                "Content-Type": "application/x-www-form-urlencoded",
                "accept-language": "id-ID",
            },
            data,
        };

        const api = await axios.request(config);
        return api.data;
    }
}

export default Pxpic;
