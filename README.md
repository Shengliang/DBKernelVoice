# Database Kernel Voice - AI Training Platform

**Database Kernel Voice** is a professional-grade AI training application designed for Database Internals Engineers. It uses Google Gemini 2.5 Flash to act as a "Senior Kernel Architect" (Voice: Fenrir) teaching a "Junior DBA" (Voice: Puck).

It features deep technical lectures, real C/C++ source code walkthroughs (MySQL, Postgres, Redis), and an interactive audio-transcript interface.

## 🚀 Features

*   **Deep Dive Lectures:** Covers MySQL InnoDB internals, Postgres MVCC, Raft Consensus, and more.
*   **Dual-Voice Podcast:** Teacher/Student roleplay for engaging learning.
*   **Source Code Analysis:** Displays real kernel code snippets (C/C++) synced with the audio.
*   **Interactive Transcript:** Click any paragraph to play audio from that exact point.
*   **Offline Mode:** Save lectures to local storage or download as HTML/PDF.
*   **Cloud Native Case Studies:** Detailed analysis of Aurora, DynamoDB, and AlloyDB.

## 🏗️ Architecture

The application follows a **Hybrid Client-Side Architecture** hosted on a **Monolithic Node.js Container**.

### Architecture Diagram

```mermaid
graph TD
    User[User / Browser]
    Server[Node.js Server (Cloud Run)]
    Gemini[Google Gemini API]
    Storage[Browser LocalStorage]

    %% Initialization
    User -- 1. Request App --> Server
    Server -- 2. Return React App --> User
    User -- 3. GET /api/config (Handshake) --> Server
    Server -- 4. Return API Key (Secure) --> User

    %% Search Flow
    User -- 5. Search "InnoDB Buffer Pool" --> Storage
    Storage -- 6. Cache Miss? --> Gemini
    Gemini -- 7. Return JSON + Script --> User
    User -- 8. Save Result --> Storage

    %% Audio Flow
    User -- 9. Request TTS --> Gemini
    Gemini -- 10. Return PCM Data --> User
    User -- 11. Convert PCM to WAV --> Playback