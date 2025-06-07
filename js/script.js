document.addEventListener('DOMContentLoaded', function() {
    // Replace with your Discord user ID
    const DISCORD_ID = '123456789012345678';
    
    // Lanyard API for Discord presence
    function fetchDiscordPresence() {
        fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    updateDiscordPresence(data.data);
                } else {
                    document.getElementById('discord-status').innerHTML = 
                        '<div class="discord-error">Failed to load Discord status</div>';
                }
            })
            .catch(error => {
                console.error('Error fetching Discord presence:', error);
                document.getElementById('discord-status').innerHTML = 
                    '<div class="discord-error">Failed to load Discord status</div>';
            });
    }
    
    function updateDiscordPresence(data) {
        const discordStatus = document.getElementById('discord-status');
        let statusHTML = '';
        
        // User info
        statusHTML += `
            <div class="discord-user">
                <img src="https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}" 
                     alt="Discord Avatar" class="discord-avatar">
                <div class="discord-info">
                    <div class="discord-username">${data.discord_user.username}</div>
                    <div class="discord-status-indicator">
                        <div class="status-dot status-${data.discord_status}"></div>
                        <span>${capitalizeFirstLetter(data.discord_status)}</span>
                    </div>
                </div>
            </div>
        `;
        
        // Activity (if any)
        if (data.activities && data.activities.length > 0) {
            const activity = data.activities[0];
            statusHTML += `
                <div class="discord-activity">
                    <div class="activity-header">
                        ${activity.application_id ? 
                          `<img src="https://cdn.discordapp.com/app-icons/${activity.application_id}/${activity.assets?.large_image}" 
                                alt="Activity Icon" class="activity-icon">` : ''}
                        <div class="activity-name">${activity.name}</div>
                    </div>
                    ${activity.details ? `<div class="activity-details">${activity.details}</div>` : ''}
                    ${activity.state ? `<div class="activity-details">${activity.state}</div>` : ''}
                </div>
            `;
        }
        
        // Spotify (if listening)
        if (data.spotify) {
            updateSpotifyPlayer(data.spotify);
        } else {
            document.getElementById('spotify-container').innerHTML = 
                '<div class="spotify-not-playing">Not currently listening to Spotify</div>';
        }
        
        discordStatus.innerHTML = statusHTML;
    }
    
    function updateSpotifyPlayer(spotifyData) {
        const spotifyContainer = document.getElementById('spotify-container');
        
        // Calculate progress
        const start = new Date(spotifyData.timestamps.start).getTime();
        const end = new Date(spotifyData.timestamps.end).getTime();
        const now = Date.now();
        const progress = Math.min(100, ((now - start) / (end - start)) * 100);
        
        // Format time
        const currentTime = formatTime(now - start);
        const totalTime = formatTime(end - start);
        
        const spotifyHTML = `
            <div class="spotify-now-playing">
                <img src="${spotifyData.album_art_url}" alt="Album Art" class="spotify-album-art">
                <div class="spotify-info">
                    <div class="spotify-track">${spotifyData.song}</div>
                    <div class="spotify-artist">by ${spotifyData.artist}</div>
                </div>
            </div>
            <div class="spotify-progress">
                <div class="spotify-progress-bar" style="width: ${progress}%"></div>
            </div>
            <div class="spotify-time">
                <span>${currentTime}</span>
                <span>${totalTime}</span>
            </div>
            <div class="spotify-embed">
                <iframe src="https://open.spotify.com/embed/track/${spotifyData.track_id}" 
                        width="100%" height="80" frameborder="0" allowtransparency="true" 
                        allow="encrypted-media"></iframe>
            </div>
        `;
        
        spotifyContainer.innerHTML = spotifyHTML;
    }
    
    // Helper functions
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    function formatTime(ms) {
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / (1000 * 60)) % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
    
    // Initial fetch and set up interval for updates
    fetchDiscordPresence();
    setInterval(fetchDiscordPresence, 10000); // Update every 10 seconds
    
    // Fallback for Spotify if not available through Lanyard
    function setupSpotifyEmbed() {
        // You can replace this with your Spotify playlist or profile
        const spotifyEmbedHTML = `
            <iframe src="https://open.spotify.com/embed/playlist/37i9dQZEVXcIroVdJc5khJ" 
                   width="100%" height="380" frameborder="0" allowtransparency="true" 
                   allow="encrypted-media"></iframe>
        `;
        
        // Only use this if Lanyard doesn't provide Spotify data
        if (!document.querySelector('.spotify-embed')) {
            document.getElementById('spotify-container').innerHTML = spotifyEmbedHTML;
        }
    }
    
    // Call setupSpotifyEmbed if needed
    // Uncomment the line below if you want to use a static Spotify embed instead of Lanyard data
    // setupSpotifyEmbed();
});



// Performance optimizations
document.addEventListener('DOMContentLoaded', function() {
    // Lazy load images
    const images = document.querySelectorAll('img');
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        images.forEach(img => {
            img.setAttribute('loading', 'lazy');
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const lazyLoadScript = document.createElement('script');
        lazyLoadScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(lazyLoadScript);
        
        images.forEach(img => {
            img.classList.add('lazyload');
            img.setAttribute('data-src', img.src);
            img.removeAttribute('src');
        });
    }
    
    // Debounce function for performance
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Handle errors gracefully
    window.addEventListener('error', function(e) {
        console.error('Error occurred:', e.error);
        
        // Check if error is related to Discord or Spotify
        if (e.filename.includes('lanyard') || e.message.includes('Discord')) {
            document.getElementById('discord-status').innerHTML = 
                '<div class="discord-error">Failed to load Discord status. Please check your connection.</div>';
        }
        
        if (e.filename.includes('spotify') || e.message.includes('Spotify')) {
            document.getElementById('spotify-container').innerHTML = 
                '<div class="spotify-error">Failed to load Spotify player. Please check your connection.</div>';
        }
        
        return false;
    });
    
    // Add fade-in animation for elements
    const fadeElements = document.querySelectorAll('.profile-card, .discord-presence, .spotify-player, .social-links');
    fadeElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100 * (index + 1));
    });
});

