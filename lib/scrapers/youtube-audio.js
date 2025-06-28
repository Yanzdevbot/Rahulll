import axios from 'axios';
import qs from 'qs';
import * as cheerio from 'cheerio';

class Generator {
    formatFileSize(size) {
        if (size > 1024 * 1024) return (size / (1024 * 1024)).toFixed(2) + ' MB';
        if (size > 1024) return (size / 1024).toFixed(2) + ' KB';
        return size + ' B';
    }
}

class Downloader {
    constructor() {
        this.generator = new Generator();
    }

    async ytMp3Downloader(url) {
        try {
            const headers = {
                accept: "*/*",
                "accept-language": "en-US,en;q=0.9,ar;q=0.8,id;q=0.7,vi;q=0.6",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                priority: "u=1, i",
                "sec-ch-ua": '"Microsoft Edge";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": '"Windows"',
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site",
                Referer: "https://y2hub.com/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            };
            const payload = qs.stringify({
                action: "yt_convert",
                nonce: "1495b10e48",
                youtube_url: url
            });

            const { data } = await axios.post(
                "https://youtubemp4free.com/wp-admin/admin-ajax.php",
                payload,
                { headers }
            );

            if (!data.success) {
                throw new Error("Failed to fetch video data");
            }

            const videoInfo = data.data.info;
            const slug = data.data.slug;
            const size = data.data.size;

            const response = await axios.get("https://ryin.info/", {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0"
                }
            });

            const setCookieHeaders = response.headers["set-cookie"];
            let cookies;
            if (setCookieHeaders) {
                cookies = setCookieHeaders.map((cookie) => cookie.split(";")[0]).join("; ");
            } else {
                cookies = "PHPSESSID=fl86pmq4dqgh2835b32mdm7380; csrf_cookie_name=739e04fcc21050c61c5325b34f449659; lang=en";
            }

            const pageUrl = "https://ryin.info/" + slug;
            const response2 = await axios.get(pageUrl, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0",
                    Cookie: cookies
                }
            });

            const html = response2.data;
            const $ = cheerio.load(html);
            const downloadHref = $("#download-url").attr("download-href");
            if (!downloadHref) {
                throw new Error("Download link not found on page");
            }

            return {
                creator: global.creator,
                status: true,
                title: videoInfo.title,
                thumbnail: videoInfo.thumbnail,
                description: videoInfo.description,
                viewCount: videoInfo.view_count,
                size: this.generator.formatFileSize(size),
                downloadUrl: downloadHref
            };
        } catch (error) {
            return {
                creator: global.creator,
                status: false,
                error: error.message
            };
        }
    }
}

export default Downloader;
