import axios from "axios";

const aptoide = {
    search: async function(args) {
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
    },
    download: async function(id) {
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

export default aptoide