document.addEventListener('DOMContentLoaded', function () {
    // Proxy URL to bypass CORS policy
    const proxyURL = 'https://api.allorigins.win/get?url=';
    const playlistURL = 'https://pastebin.com/raw/RfutgD5p';
    const proxyPlaylistURL = proxyURL + encodeURIComponent(playlistURL);

    fetch(proxyPlaylistURL)
        .then(response => response.json())
        .then(data => {
            const playlistContent = data.contents;
            const playlist = document.getElementById('playlist');
            const lines = playlistContent.split('\n');
            let firstStreamUrl = null;
            lines.forEach((line, index) => {
                if (line.startsWith('#EXTINF')) {
                    const title = line.split(',')[1];
                    const url = lines[index + 1].trim();
                    const listItem = document.createElement('li');
                    listItem.className = 'list-group-item';
                    listItem.innerHTML = `<a href="#" data-url="${url}">${title}</a>`;
                    playlist.appendChild(listItem);
                    
                    // Set the first stream URL
                    if (firstStreamUrl === null) {
                        firstStreamUrl = url;
                    }
                }
            });

            // Play the first stream by default
            if (firstStreamUrl !== null) {
                playStream(firstStreamUrl);
            }

            playlist.addEventListener('click', function (event) {
                event.preventDefault();
                if (event.target && event.target.nodeName === 'A') {
                    const streamUrl = event.target.getAttribute('data-url');
                    playStream(streamUrl);
                }
            });

            // Hide the loading screen after at least 1 second
            setTimeout(function () {
                document.getElementById('loading-screen').style.display = 'none';
                document.getElementById('content').style.display = 'block';
            }, 1800); // 1800 milliseconds = 1 second
        })
        .catch(error => console.error('Error fetching the playlist:', error));

    // Create a single instance of the player
    const playerElement = document.getElementById('player');
    const player = new shaka.Player({
        parentId: "#player",
        width: '100%',
        height: '100%',
        autoPlay: true,
        mediacontrol: {seekbar: "#bb86fc", buttons: "#e0e0e0"},
        mute: false,
    });

    function playStream(url) {
        player.load(url);
    }
});

// Check if the stream is an HLS stream or DASH
            if (manifestUri.endsWith('.m3u8')) {
                // HLS stream - use HLS.js
                if (Hls.isSupported()) {
                    const hls = new Hls();
                    hls.loadSource(manifestUri);
                    hls.attachMedia(video);
                    hls.on(Hls.Events.MANIFEST_PARSED, function () {
                        console.log("HLS stream loaded");
                    });
                } else {
                    console.error("HLS is not supported in this browser.");
                }
            } else {
                // DASH stream - use Shaka Player
                let clearKeys = null;
                if (clearkey != null) {
                    let [kid, key] = clearkey.split(":").map(item => item.trim());
                    clearKeys = {};
                    clearKeys[kid] = key;
                }

                // Destroy existing player if it exists
                if (player) {
                    player.destroy().catch(error => {
                        console.error("Error destroying the player:", error);
                    });
                }

// Initialize new player
                player = new shaka.Player(player);

                player.configure({
    drm: {
        servers: {
            'com.widevine.alpha': licenseServer
        },
        clearKeys: clearKeys || {}
    },
    streaming: {
        bufferingGoal: 0  // ✅ This is a valid setting
    }
});
