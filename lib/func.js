import fetch from 'node-fetch';

const getImage = async (input) => {
    let buffer;

    try {
        if (input.startsWith('http://') || input.startsWith('https://')) {
            const response = await fetch(input, {
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Accept': 'image/*,*/*',
                    'Accept-Encoding': 'gzip, deflate, br'
                },
                redirect: 'follow',
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const arrayBuffer = await response.arrayBuffer();
            buffer = Buffer.from(arrayBuffer);
        } else {
            let base64Data = input;
            
            if (input.startsWith('data:')) {
                const base64Marker = ';base64,';
                const base64Index = input.indexOf(base64Marker);
                if (base64Index !== -1) {
                    base64Data = input.substring(base64Index + base64Marker.length);
                }
            }
            
            base64Data = base64Data.trim();
            buffer = Buffer.from(base64Data, 'base64');
            
            if (buffer.length === 0) {
                throw new Error('Invalid base64 image data');
            }
        }
        
        return buffer;
    } catch (error) {
        throw new Error(`Image processing failed: ${error.message}`);
    }
}


export {
    getImage
};
