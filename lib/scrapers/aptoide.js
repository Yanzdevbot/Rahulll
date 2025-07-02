import axios from 'axios';

class Aptoide {
    /**
     * Search apps on Aptoide
     * @param {string} args - Search query
     * @returns {Promise<Object[]>} - Array of objects containing app information
     **/
    async search(args) {
        let res = await axios.get(`https://ws75.aptoide.com/api/7/apps/search?query=${args}&limit=1000`)
        let ress = {}
        res = res.data
        ress = res.datalist.list.map(v => {
            return {
                name: v.name,
                size: v.size,
                version: v.file.vername,
                id: v.package,
                download: v.stats.downloads
            }
        })
        return ress
    }

    /**
     * Download an app from Aptoide
     * @param {string} id - Aptoide app ID
     * @returns {Promise<Object>} - Object containing app information and download link
     **/
    async download(id) {
        let res = await axios.get(`https://ws75.aptoide.com/api/7/apps/search?query=${id}&limit=1`)
        res = res.data
        return {
            img: res.datalist.list[0].icon,
            developer: res.datalist.list[0].store.name,
            appname: res.datalist.list[0].name,
            link: res.datalist.list[0].file.path
        }
    }
}

export default Aptoide