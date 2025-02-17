# AI-Powered Fact Checker

**Meeting Date:** 15 Feb 2025

## Overview

The AI-Powered Fact Checker is an advanced system designed to combat misinformation and disinformation. By leveraging state-of-the-art AI technologies, this project provides real-time fact verification, personalized misinformation alerts, and detailed analysis of claims. The system not only identifies inaccuracies but also offers a decomposition of each claim into its true and false components.

## Table of Contents

- [Project Idea](#project-idea)
- [How It Works](#how-it-works)
- [Key Features](#key-features)
- [Unique Selling Points](#unique-selling-points)
- [Tech Stack](#tech-stack)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Git Flow & Project Management](#git-flow--project-management)
- [Work Allocation](#work-allocation)
- [Development Roadmap](#development-roadmap)
- [Activities & Progress Tracking](#activities--progress-tracking)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [License](#license)

## Project Idea

The core of this project is an **AI-powered fact-checking system** that combats misinformation and disinformation. It provides:

- **Real-time alerts** for emerging false claims.
- **Personalized fact-checking**, adjusting to user interests and trusted sources.
- **Detailed claim analysis** that breaks down statements into percentages of truth and falsehood (e.g., "Chilima died of heart attack" becomes “true: Chilima died; false: not due to heart attack”).
- **YouTube authenticity verification** for viewership and content legitimacy.

## How It Works

1. **Query Reception:**  
   When a search query or fact is submitted, the AI-powered agent initiates the fact-checking process.

2. **Data Aggregation:**  
   The system scans the internet for authentic and reliable sources. It downloads or scrapes data from these trusted sites to gather comprehensive information related to the query.

3. **Bias Removal & Analysis:**  
   Advanced AI algorithms process the collected data to remove inherent biases. Natural language processing techniques help in cleaning and normalizing the data for further analysis.

4. **Decomposition & Verification:**  
   The system decomposes the claim into its factual elements. For example, a statement like "Chilima died of heart attack" is analyzed to confirm the fact of death separately from the cause. This results in a detailed breakdown that highlights what is true and what might be inaccurate.

5. **Result Delivery:**  
   Finally, the fact-checker returns a trust score, a breakdown of truth versus falsehood, and real-time alerts if any misinformation is detected. This entire process is powered by AI, ensuring rapid and accurate fact verification.

## Key Features

- **Real-Time Alerts:** Immediate notifications about potential misinformation.
- **Ranking & Trust Scoring:** Evaluates and scores sources based on past reliability.
- **Decomposition Analysis:** Breaks down claims into accurate and inaccurate components.
- **AI-Powered Verification:** Utilizes advanced language models and algorithms to verify facts.
- **Localization & Accessibility:**
  - Supports Chichewa language.
  - Audio-based accessibility options.
- **Platform Scalability:**
  - Browser extension.
  - Web application.
  - Mobile integration (including social media platforms).

## Unique Selling Points

- **AI-Driven Verification:** Beyond conventional search methods, our system uses AI to provide nuanced fact-checking.
- **Combat Misinformation & Disinformation:** Dedicated to identifying and combating false narratives.
- **Personalized Alerts:** Tailors notifications based on user preferences and past behavior.
- **Advanced Analysis:** Provides detailed breakdowns of statements to distinguish between partial truths and complete falsehoods.
- **Multi-Platform & Multilingual:** Designed to be accessible on web, mobile, and via browser extensions, with localization (e.g., Chichewa) and audio options.

## Tech Stack

### Frontend

- **Next.js:** Server-rendered React framework.
- **Copilotkit:** Rapid UI component development.
- **Framer Motion:** Smooth, interactive animations.
- **Shadcn UI:** Modern, responsive UI components.
- **Tailwind CSS:** Utility-first styling with skeleton loading for data.

### Backend

- **Copilotkit:** Backend integration utilities.
- **FastAPI:** High-performance API framework.
- **Langchain & Langraph:** For advanced language processing and graph-based analysis.

## Git Flow & Project Management

- **Branches:**
  - `main` & `dev` for production and active development.
  - `reg_branch` for regional feature development.
  - Merging branches for frontend (`frontend_development`) and backend (`backend_development`).
  - Regional branches:
    - `[reg]_frontend` for Maya & Sam.
    - `[reg]_backend` for Tony & Dan.
- **GitHub Management:**
  - Forking and pull requests to facilitate collaboration.

## Work Allocation

- **Frontend:** Mayamiko & Sam
- **Backend:** Dan & Tony

## Development Roadmap

**Total Duration:** 10 Weeks

- **Weeks 1-2:** UI/UX design, environment setup, GitHub configuration.
- **Week 3:** Initial testing and refining of core functionalities.
- **Week 4:** Implementation of ranking, trust scoring, and claim decomposition.
- **Weeks 5-7:** Integration of YouTube authenticity checks, audio features, and localization.
- **Weeks 8-9:** Extensive testing and scalability enhancements.
- **Week 10:** Final testing and system scalability improvements.

## Activities & Progress Tracking

- **Meeting Schedule:**
  - Weekly on Tuesday (1hr) and Saturday (1hr)
- **Key Activities:**
  - Environment setup & configuration.
  - UI/UX design and interface building.
  - Backend core development and authentication implementation.
  - AI algorithm design for fact verification and claim decomposition.
  - Comprehensive testing and iterative improvements.
  - Deployment and documentation.

## Getting Started

1. **Clone the repository:**
   ```sh
   git clone git@github.com:your-username/ai-powered-fact-checker.git
   ```
2. **Navigate into the project directory:**

   ```sh
   cd ai-powered-fact-checker
   ```

3. **Install Frontend Dependencies:**

   ```sh
   cd frontend
   npm install
   ```

4. **Install Backend Dependencies:**
   ```sh
   cd ../backend
   pip install -r requirements.txt
   ```

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
