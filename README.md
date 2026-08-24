# ⚕️ DocTube: Clinical Case Library Platform

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg) ![License](https://img.shields.io/badge/license-Proprietary-red.svg) ![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)

> **DocTube** is a high-performance, secure clinical case library platform. It features a React-based frontend with integrated medical imaging capabilities and a robust Node.js backend handling secure data storage.

## 📖 Table of Contents
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Interactive Getting Started Guide](#-interactive-getting-started-guide)
  - [1. Prerequisites](#1-prerequisites)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
- [Core Workflows](#-core-workflows-how-to-use)
- [Project Structure](#-project-structure)
- [Legal & Copyright](#-legal--copyright)

---

## 🏗️ Architecture & Tech Stack

This platform is divided into two decoupled services to ensure scalability and maintainability:

- **Frontend (`doctube-frontend`):** A modern Single Page Application (SPA) built with **React** and **Vite**. Core UI components include a custom `DicomViewer` for medical imaging rendering, a `MediaGallery` for efficient case browsing, and a secure `AdminPanel` for data management.
- **Backend (`doctube-backend`):** A RESTful **Node.js** and **Express** API connected to a **PostgreSQL** database. It utilizes **bcrypt** for secure credential hashing and interfaces with **Azure Blob Storage** for the secure, compliant storage of clinical media files.

---

## 🚀 Interactive Getting Started Guide

Follow these steps to bootstrap the DocTube development environment on your local machine.

### 1. Prerequisites

Ensure your local environment meets the following requirements:

- [Node.js](https://nodejs.org/) (v18+ recommended)
- npm or yarn package manager
- PostgreSQL (Local instance or cloud-hosted URI)
- Azure Storage Account (Connection String & Container Name)

### 2. Backend Setup

Initialize the API server and database connections.

```bash
# Navigate to the backend directory
cd doctube-backend

# Install required dependencies
npm install

# Configure your environment variables
cp .env.example .env
# Open .env and input your PostgreSQL URI, JWT secret, and Azure Blob Storage credentials

# Start the development server
npm run dev
```

The backend API will initialize and listen on `http://localhost:5000`.

### 3. Frontend Setup

Open a new terminal session to compile and serve the client interface.

```bash
# Navigate to the frontend directory
cd doctube-frontend

# Install Vite and React dependencies
npm install

# Start the Vite development server
npm run dev
```

The frontend client will compile and become available at `http://localhost:5173`.

---

## 🛠 Core Workflows (How to Use)

Once the environment is running, utilize the following core workflows to interact with the platform:

- **Secure Authentication:** Navigate to the client URL. Log in using authorized credentials. The backend handles session validation via secure, HTTP-only tokens.
- **Reviewing Clinical Cases:** Access the Media Gallery dashboard to browse the patient case library. Selecting a case containing DICOM files will automatically launch the DICOM Viewer for in-browser diagnostic viewing.
- **Data Administration:** Users provisioned with administrative roles can access the Admin Panel to upload new imaging files (routed securely to Azure), manage user access tiers, and oversee system health.

---

## 📂 Project Structure

A high-level overview of the repository's critical routing and component architecture:

```
📦 doctube
 ┣ 📂 doctube-frontend            # Vite + React Client Engine
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📂 components
 ┃ ┃ ┃ ┣ 📜 AdminPanel.jsx        # Administrative dashboard logic
 ┃ ┃ ┃ ┣ 📜 DicomViewer.jsx       # Custom medical image rendering engine
 ┃ ┃ ┃ ┗ 📜 MediaGallery.jsx      # Case library browsing interface
 ┃ ┃ ┗ 📂 styles                  # Centralized theme and UI design tokens
 ┣ 📂 doctube-backend             # Node.js + Express API Server
 ┃ ┣ 📂 node_modules
 ┃ ┃ ┗ 📂 bcrypt                  # Cryptographic dependency for auth
 ┃ ┗ 📜 .env                      # Secrets and configuration (Git-ignored)
```

---

## 🛑 Legal & Copyright

© 2026 Sandhya Patel. All Rights Reserved.

**STRICTLY CONFIDENTIAL AND PROPRIETARY.**

This project, including both the frontend and backend architectures, is entirely closed-source and proprietary.

You may not use, copy, modify, merge, publish, distribute, sublicense, or sell copies of any part of this software.

Unauthorized use, reproduction, or distribution of this codebase, in whole or in part, is strictly prohibited and will be subject to immediate legal action.
