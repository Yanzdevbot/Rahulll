import { fileTypeFromBuffer } from "file-type"
import axios from "axios"
import qs from "qs"

const tool = ["removebg", "enhance", "upscale", "restore", "colorize"]

const pxpic = {
    upload: async (buffer) => {
        const { ext, mime } = await fileTypeFromBuffer(buffer) || {}
        const fileName = `${Date.now()}.${ext}`
        const folder = "uploads"

        const response = await axios.post("https://pxpic.com/getSignedUrl", { folder, fileName }, {
            headers: { "Content-Type": "application/json" }
        })

        const { presignedUrl } = response.data
        await axios.put(presignedUrl, buffer, { headers: { "Content-Type": mime } })

        const cdnDomain = "https://files.fotoenhancer.com/uploads/"
        return cdnDomain + fileName
    },

    create: async (buffer, tools) => {
        if (!tool.includes(tools)) {
            return `Pilih salah satu dari tools ini: ${tool.join(", ")}`
        }

        const url = await pxpic.upload(buffer)
        const data = qs.stringify({
            imageUrl: url,
            targetFormat: "png",
            needCompress: "no",
            imageQuality: "100",
            compressLevel: "6",
            fileOriginalExtension: "png",
            aiFunction: tools,
            upscalingLevel: "",
        })

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
        }

        const api = await axios.request(config)
        return api.data
    },
}

export default pxpic