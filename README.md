# Focus Web App

A premium, minimalist real-time clock and Pomodoro timer designed for focus and aesthetics. Built with React and Vite.

## Features

*   **Real-Time Clock**: massive, edge-to-edge digital display with a split-flap aesthetic.
*   **Pomodoro Timer**:
    *   Focus and Break sessions (default 25/5 min).
    *   Auto-switch logic (Focus -> Break).
    *   Stops automatically after Break.
    *   Pleasant bell notification sound.
*   **Design**:
    *   Dark mode only (OLED friendly).
    *   Metallic gradient typography (Oswald font).
    *   Responsive 2-card layout (HH MM) scaling with viewport.
*   **Controls**:
    *   **Brain Button**: Toggle between Clock and Timer. Active state glows green.
    *   **Fullscreen**: Dedicated toggle button.
    *   **Settings**: Click the Gear icon in Timer mode to adjust durations.
    *   **Idle Hide**: Controls fade out after 3 seconds of inactivity.

## Setup

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Run development server:
    ```bash
    npm run dev
    ```

3.  Build for production:
    ```bash
    npm run build
    ```

## Deployment (Netlify)

1.  Drag and drop the `dist/` folder (created after running build) into Netlify Drop.
2.  Or connect your GitHub repository and set the build command to `npm run build` and publish directory to `dist`.
