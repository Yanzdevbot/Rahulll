import fetch from 'node-fetch';

const getImage = async (link) => {
    const response = await fetch(link, {
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0',
            'Accept': 'image/*,*/*',
            'Accept-Encoding': 'gzip, deflate, br'
        },
        redirect: 'follow',
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch image. Status: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return buffer;
}

export {
    getImage
};
