import fetch from 'node-fetch'

const client_id = process.env.SPOTIFY_ID
const client_secret = process.env.SPOTIFY_SECRET
const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64")
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`

async function getAccessToken() {
    const response = await fetch(TOKEN_ENDPOINT, {
        method: "POST",
        headers: {
            Authorization: `Basic ${basic}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            grant_type: "client_credentials"
        })
    })

    return response.json()
}

const SpotifyAPI = async () => {
    const { access_token } = await getAccessToken()

    return {
        getUserData: async () => {
            const response = await fetch('https://api.spotify.com/v1/me', {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + access_token,
                },
            })
            return response.json()
        },
        getUserPlaylists: async (limit) => {
            const response = await fetch(`https://api.spotify.com/v1/me/playlists?limit=${limit}`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + access_token,
                    },
                }
            )
            return response.json()
        },
        getUserQueueData: async () => {
            const response = await fetch('https://api.spotify.com/v1/me/player', {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + access_token,
                },
            })
            return response.json()
        },
        addTrackToQueue: async (trackId) => {
            const response = await fetch(`https://api.spotify.com/v1/me/player/queue?uri=spotify:track:${trackId}`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    }
                }
            )
            return response.json()
        },
        playPausePlayback: async (action) => {
            const response = await fetch(`https://api.spotify.com/v1/me/player/${action}`, {
                method: 'PUT',
                headers: {
                    Authorization: 'Bearer ' + access_token,
                    'Content-Type': 'application/json',
                }
            })
            return response.json()
        },
        nextPlaybackTrack: async () => {
            const response = await fetch('https://api.spotify.com/v1/me/player/next', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + access_token,
                    'Content-Type': 'application/json',
                }
            })
            return response.json()
        },
        trackSearch: async (track) => {
            const response = await fetch(`https://api.spotify.com/v1/search?q=${track}&type=track&limit=20`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + access_token,
                    }
                }
            )
            return response.json()
        },
        getTracks: async (trackID, market = 'IN') => {
            const response = await fetch(`https://api.spotify.com/v1/tracks/${trackID}?market=${market}`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + access_token,
                    }
                }
            )
            return response.json()
        },
        getPlaylistTracks: async (playlistId) => {
            const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + access_token,
                    }
                }
            )
            return response.json()
        }
    }
}

export {
    SpotifyAPI
}