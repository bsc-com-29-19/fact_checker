# Fact Checker Backend

A robust backend service for fact-checking using the power of **Langgraph**, **Langchain**, and **Copilotkit**. This repository provides an API-driven platform designed to verify the credibility of information quickly and efficiently.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Git Flow & Management](#git-flow--management)
- [Get Started](#get-started)
- [License](#license)

---

## Overview

The Fact Checker Backend is engineered to leverage modern natural language processing tools to analyze and validate facts. By integrating **Langgraph**, **Langchain**, and **Copilotkit**, the backend efficiently processes data to offer reliable fact-checking services. It is designed with scalability and ease of maintenance in mind, ensuring that updates and improvements can be managed smoothly through a structured Git workflow.

---

## Tech Stack

- **Programming Language:** Python
- **Frameworks & Libraries:**
  - [Langgraph](https://github.com/langgraph/langgraph)
  - [Langchain](https://github.com/hwchase17/langchain)
  - [Copilotkit](https://github.com/copilotkit/copilotkit)
- **Other Tools:**
  - Git for version control
  - Virtual environments (e.g., `.venv`, `virtualenv`)
  - Pip for dependency management

---

## Git Flow & Management

This project follows a streamlined Git workflow to ensure efficient collaboration and code management:

- **Main Repository:** [fact_checker](git@github.com:bsc-com-29-19/fact_checker.git)
- **Branching Strategy:**

  - **Production & Active Development:**
    - **`backend`**: Contains the production-ready code.
    - **`dev`**: Used for active development and integration of new features before they are merged into production.

- **Regional Feature Development:**

  - **`reg_branch`**: Dedicated to regional feature development.

- **Feature-Specific Merging:**

  - **Backend:** Uses a separate branch called **`backend_development`** for feature integration.

- **Regional Branches:**

  - **`[reg]_backend`**: Branches for backend regional development managed by Tony & Dan.

- **Best Practices:**
  - Keep commits small and focused.
  - Write clear commit messages.
  - Regularly pull the latest changes from the `backend` branch to stay updated.

---

## Get Started

Follow these steps to set up the Fact Checker Backend on your local machine:

1. **Clone the Repository:**

   ```bash
   git clone git@github.com:bsc-com-29-19/fact_checker.git
   ```

2. **Checkout the Backend Branch:**

   ```bash
   git checkout backend

   ```

3. **Navigate to the Backend Directory:**

   ```bash
   cd fact_checker_backend
   ```

4. **Install the Required Dependencies:**

   ```bash
   pip install -r requirements.txt

   ```

5. **Run the API Server (Fast Run):**

   ```bash
   python fact_checker_agent/api.py

   ```
