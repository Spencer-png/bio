# Clean Bio Website

A clean, dark-themed bio website that can be hosted on GitHub Pages. Features include Discord presence integration via Lanyard API and a Spotify player to show what you're currently listening to.

## Features

- Dark theme design
- Responsive layout for all devices
- Discord presence integration using Lanyard API
- Spotify player integration
- Social media links
- Easy to customize

## Setup Instructions

### 1. Fork or Clone the Repository

Start by forking this repository to your GitHub account or clone it directly.

### 2. Customize Your Information

Edit the following files to personalize your bio website:

- **index.html**: Update your name, bio, and social media links
- **js/script.js**: Replace the `DISCORD_ID` variable with your Discord user ID
- **images/avatar.png**: Replace with your own profile picture

### 3. Discord Integration Setup

To display your Discord presence:

1. Join the [Lanyard Discord server](https://discord.gg/lanyard)
2. Get your Discord user ID (enable Developer Mode in Discord settings, right-click your profile, and select "Copy ID")
3. Replace the `DISCORD_ID` in the script.js file with your Discord ID

### 4. Spotify Integration

The website will automatically display what you're listening to on Spotify if:

1. Your Discord account is linked to Spotify
2. You have "Display Spotify as your status" enabled in Discord settings

Alternatively, you can use a static Spotify embed by uncommenting the `setupSpotifyEmbed()` function call in script.js and replacing the playlist ID with your own.

### 5. Deploy to GitHub Pages

1. Push your changes to your GitHub repository
2. Go to your repository settings
3. Navigate to the "Pages" section
4. Select the branch you want to deploy (usually "main" or "master")
5. Save the settings and wait for GitHub to deploy your site
6. Your site will be available at `https://yourusername.github.io/repository-name/`

## Customization

### Colors

You can customize the colors by editing the CSS variables in the `css/style.css` file:

```css
:root {
    --bg-color: #121212;
    --card-bg: #1e1e1e;
    --text-primary: #ffffff;
    --text-secondary: #b3b3b3;
    --accent-color: #7289da;
    --spotify-green: #1db954;
    --border-radius: 12px;
    --box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}
```

### Social Media Links

Edit the social media links in the `index.html` file:

```html
<div class="social-links">
    <h3>Connect With Me</h3>
    <div class="links">
        <a href="#" class="social-link"><i class="fab fa-github"></i></a>
        <a href="#" class="social-link"><i class="fab fa-twitter"></i></a>
        <a href="#" class="social-link"><i class="fab fa-instagram"></i></a>
        <a href="#" class="social-link"><i class="fab fa-linkedin"></i></a>
        <a href="#" class="social-link"><i class="fab fa-twitch"></i></a>
    </div>
</div>
```

## License

This project is open source and available under the MIT License.

