# Four Years, One Story

A one-page cinematic scrapbook — four chapters, one continuous scroll, one soundtrack, no reloads. Built for a birthday.

## 1. Add your files

Drop these two files into the `assets/` folder, with these exact names:

- `assets/song.mp3` — your Iktara file
- `assets/photo.jpg` — your photo of the two of you

The site is already wired to look for them there. If the photo is missing, that spot will just say so instead of breaking.

## 2. Personalize the text

Everything you need to change is marked `EDIT ME` inside `index.html`. Open the file in any text editor and search for `EDIT ME` — you'll find:

| Where | What to write |
|---|---|
| Intro screen | Your name (as "director") |
| Chapter I | The real story of how you met |
| Chapter II | The football memory, the JEE memory, the inside joke |
| Chapter II — fragments archive | Swap in his real favorite artists + a one-line "why" for each (add or remove `.fragment` blocks freely — the layout adjusts on its own) |
| Chapter III | The polaroid caption + the full friendship letter |
| Chapter IV | His name, the final birthday message, your sign-off |

Everything else — the animations, the letterbox bars, the confetti, the music player — is already built and doesn't need touching.

## 3. Preview it locally

Just double-click `index.html` to open it in a browser. Note: some browsers block audio/local file loading slightly differently — if the song doesn't play locally, it will work fine once deployed (step 4).

## 4. Put it on GitHub so he can see it

1. Create a new repository on GitHub (public, so Pages can serve it).
2. Upload this whole folder's contents to the repo (drag-and-drop on github.com works, or `git push` if you're comfortable with git).
3. In the repo, go to **Settings → Pages**.
4. Under "Build and deployment," set **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)`. Save.
5. GitHub gives you a live link after a minute or two, usually `https://yourusername.github.io/repo-name/`.
6. Send him that link.

## File structure

```
index.html          → the whole story, structure + content
css/style.css        → all visual styling
js/main.js           → scroll reveals, typewriter, parallax, confetti, music player
assets/song.mp3       → (you add this)
assets/photo.jpg      → (you add this)
```

## A note on the music

Because Iktara is a copyrighted track, it couldn't be bundled in for you — you'll need to add your own legally-owned mp3 as `assets/song.mp3`. Everything else (the player UI, the progress bar, the autoplay-on-click) is already done.
