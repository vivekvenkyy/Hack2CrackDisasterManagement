Below is a comprehensive `README.md` file for the **Suraksha** project, which encompasses the mental health support platform with a chatbot powered by the Gemini 1.5 Flash API. The README provides an overview of the project, setup instructions, usage details, file structure, and additional information for contributors and users.

---

# Suraksha

**Suraksha** is a mental health support platform designed to provide empathetic and supportive assistance to survivors through a chatbot powered by the Gemini 1.5 Flash API. The platform includes features for users to post emergencies, volunteers to accept and respond to emergencies, and a chatbot for mental health support. The chatbot is accessible via a floating widget, ensuring a non-intrusive user experience.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Chatbot Integration](#chatbot-integration)
- [Safety and Ethical Considerations](#safety-and-ethical-considerations)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features
- **Emergency Posting and Management**:
  - Users can post emergencies with a title, description, and user ID.
  - Volunteers can view and accept/decline emergencies.
  - Emergencies are stored in a JSON file (`data/emergency.json`) for persistence.
- **Mental Health Support Chatbot**:
  - A chatbot powered by the Gemini 1.5 Flash API provides empathetic and supportive responses for mental health survivors.
  - The chatbot appears as a floating widget (chat icon) in the bottom-right corner of the screen.
  - Clicking the icon opens a compact chat window where users can interact with the chatbot.
  - Includes a system instruction to ensure responses are non-judgmental, encouraging, and safe.
- **User and Volunteer Dashboards**:
  - `UserDashboard`: Allows users to post and manage their emergencies.
  - `VolunteerDashboard`: Allows volunteers to view and accept/decline emergencies.
- **Real-Time Updates**:
  - Polling is used to fetch emergencies every 10 seconds (configurable).
- **Safety Features**:
  - Disclaimer in the chatbot window informing users that the chatbot is not a licensed professional.
  - Links to mental health resources (e.g., NAMI, National Suicide Prevention Lifeline).
  - Encourages users to seek professional help for serious issues like self-harm.

## Tech Stack
- **Frontend**: Next.js (React), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Data Storage**: JSON file (`data/emergency.json`)
- **Chatbot API**: Gemini 1.5 Flash API (Google Generative AI)
- **Libraries**:
  - `axios`: For making API requests.
  - `react-hot-toast`: For user notifications.
  - `framer-motion`: For animations.
  - `react-icons`: For icons in the UI.
- **Styling**: Tailwind CSS with the Inter font (via Google Fonts)

## Prerequisites
- **Node.js**: Version 18.x or higher
- **npm**: Version 8.x or higher
- **Gemini API Key**: Obtain an API key from Google Cloud for the Gemini 1.5 Flash API.

## Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/suraksha.git
   cd suraksha
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env.local` file in the root directory and add the following:
   ```env
   NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key
   ```
   Replace `your-gemini-api-key` with your actual Gemini API key.

4. **Create the Data Directory**:
   The project uses a JSON file for data persistence. Create the `data` directory and ensure the server has write permissions:
   ```bash
   mkdir -p data
   chmod -R 755 data
   ```

5. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:3000`.

## Usage
1. **Access the Platform**:
   - Visit `http://localhost:3000` to see the main page with sample content.
   - The chatbot icon (a speech bubble) is located in the bottom-right corner of the screen.

2. **Interact with the Chatbot**:
   - Click the chat icon to open the chat window.
   - Type a message (e.g., “I’ve been feeling overwhelmed lately”) and press Enter or click “Send”.
   - The chatbot will respond with an empathetic and supportive message.
   - Close the chat window by clicking the “X” button in the header.

3. **User Dashboard**:
   - Navigate to `/user-dashboard` (you may need to set up authentication to access this route).
   - Post an emergency by filling out the form with a title, description, and user ID.
   - View your posted emergencies in the “Your Emergencies” section.

4. **Volunteer Dashboard**:
   - Navigate to `/volunteer-dashboard` (requires authentication).
   - View available emergencies and click “Accept” or “Decline” to respond.
   - Accepted emergencies will update their status to “accepted” and notify the user.

## Project Structure
```
suraksha/
├── app/
│   ├── api/
│   │   ├── accept/
│   │   │   └── route.ts        # API route to accept an emergency
│   │   ├── decline/
│   │   │   └── route.ts        # API route to decline an emergency
│   │   ├── emergency/
│   │   │   └── route.ts        # API route to get/post emergencies
│   │   └── profile/
│   │       └── route.ts        # API route to fetch user profile (placeholder)
│   ├── globals.css             # Global styles with Tailwind CSS
│   ├── layout.tsx              # Root layout with metadata and Inter font
│   └── page.tsx                # Main page with sample content and Chatbot
├── components/
│   ├── Chatbot.tsx             # Chatbot component with floating widget
│   ├── EmergencyForm.tsx       # Form to post an emergency
│   ├── EmergencyList.tsx       # List to display emergencies
│   └── [Other components]      # Additional components (e.g., UserDashboard, VolunteerDashboard)
├── data/
│   └── emergency.json          # JSON file for storing emergencies
├── lib/
│   ├── db.ts                   # Functions to read/write to emergency.json
│   └── types.ts                # TypeScript type definitions
├── public/                     # Static assets
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── .env.local                  # Environment variables (not committed)
├── .gitignore                  # Git ignore file
├── package.json                # Project dependencies and scripts
└── README.md                   # Project documentation
```

## API Endpoints
- **GET /api/emergency**:
  - Fetches all emergencies.
  - Response: Array of emergencies (`Emergency[]`).
- **POST /api/emergency**:
  - Creates a new emergency.
  - Request Body: `{ title: string, description: string, user: string }`
  - Response: Created emergency object with status 201.
- **POST /api/accept**:
  - Accepts an emergency by adding a volunteer to its `volunteers` array.
  - Request Body: `{ emergencyId: string, volunteer: string }`
  - Response: Updated emergency object.
- **POST /api/decline**:
  - Declines an emergency (updates status or removes volunteer).
  - Request Body: `{ emergencyId: string, volunteer: string }`
  - Response: Updated emergency object.
- **GET /api/profile**:
  - Placeholder endpoint for fetching user profile (requires authentication setup).

## Chatbot Integration
The chatbot is powered by the Gemini 1.5 Flash API and provides mental health support:
- **API Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`
- **System Instruction**: Ensures responses are empathetic, non-judgmental, and encouraging.
- **Features**:
  - Floating chat icon in the bottom-right corner.
  - Toggleable chat window with conversation history.
  - Auto-scrolling to the latest message.
  - Loading indicator while fetching responses.
  - Error handling with user-friendly notifications.

## Safety and Ethical Considerations
- **Disclaimer**: The chatbot includes a disclaimer stating it is not a licensed mental health professional.
- **Resources**: Links to NAMI and the National Suicide Prevention Lifeline (1-800-273-8255) are provided.
- **Self-Harm Detection**: The chatbot encourages users to seek professional help if they express thoughts of self-harm or suicide.
- **Data Privacy**: No user data is stored beyond the current session (unless enhanced with persistence features).

## Contributing
Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit (`git commit -m "Add your feature"`).
4. Push to your branch (`git push origin feature/your-feature`).
5. Open a pull request with a detailed description of your changes.

Please ensure your code follows the project’s coding style and includes appropriate tests.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact
For questions or support, please contact:
- **Email**: your-email@example.com
- **GitHub Issues**: [Suraksha Issues](https://github.com/your-username/suraksha/issues)

---

### Notes for the README
- **Placeholder Values**: Replace `your-username` and `your-email@example.com` with your actual GitHub username and email address.
- **License File**: If you want to include a `LICENSE` file, create one in the project root with the MIT License text (or your preferred license).
- **Authentication**: The README mentions authentication for the dashboards but does not include implementation details, as the project currently uses placeholder API routes (`/api/profile`). You can extend the project by adding authentication (e.g., using NextAuth.js).
- **Deployment**: You can add a section on deployment (e.g., to Vercel) if you plan to deploy the project.

This README provides a comprehensive overview of the Suraksha project, making it easy for users and contributors to understand and get started. Let me know if you’d like to add more sections or details!
