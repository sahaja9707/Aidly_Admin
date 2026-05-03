Aidly — Community-Powered Assistance Platform

Aidly is a human-centric community resilience platform designed to provide instant, accessible, and secure assistance to individuals in everyday situations and non-emergency scenarios.

The platform connects users such as elderly individuals, visually impaired people, digitally inexperienced users, and travelers with verified volunteers through real-time audio and video communication.

Problem Statement

Many individuals face challenges in:

Reading labels, forms, or instructions
Overcoming language barriers while traveling
Navigating unfamiliar environments
Accessing immediate non-emergency assistance

Existing solutions are often complex, inaccessible, or limited to emergency use cases. There is a clear need for a simple, real-time, human-assisted support system.

Solution

Aidly enables users to instantly connect with verified volunteers who can assist them in real time through audio and video communication. The platform is designed to be simple, inclusive, and accessible to users with varying levels of technical proficiency.

Key Features
One-Tap Assistance

Users can quickly connect with available volunteers without navigating complex interfaces.

Real-Time Communication

Supports low-latency audio and video communication using WebRTC.

Accessibility-First Design

The interface is designed for ease of use, with simple navigation, clear layouts, and support for users with limited technical familiarity.

Multilingual Support

Integrated translation capabilities help users communicate across different languages.

Verified Volunteer Network

Ensures trust and safety through authentication and role-based access control.

Task-Based Assistance

Supports a wide range of real-world use cases, including:

Reading instructions or labels
Filling out forms
Identifying objects
Providing translation assistance
Tech Stack

Frontend:

React Native

Backend:

Supabase (Authentication and Database)

Real-Time Communication:

WebRTC

Additional Integrations:

Translation APIs
Role-based access control
System Architecture
User → Request Help → Supabase Backend → Match Volunteer → WebRTC Connection
                                      ↓
                               Authentication & Database
User Flow
User opens the application
User selects "Get Help"
System matches the user with an available volunteer
Audio or video connection is established
Assistance is provided
Session ends with optional feedback
Security and Trust
Verified volunteer onboarding process
Secure authentication using Supabase
Controlled, session-based communication
No storage of sensitive interaction data
Use Cases
Assisting elderly users with reading instructions
Supporting visually impaired individuals in object identification
Helping travelers with language translation
Providing quick, real-time help for everyday tasks
Impact

Aidly promotes digital inclusion by making assistance accessible to a wider audience. It leverages community participation to deliver meaningful, real-time support and improve everyday experiences.

Future Improvements
AI-based object detection support
Offline fallback for critical scenarios
Location-based smart volunteer matching
Volunteer reputation and trust scoring system
Integration with local support services
Team

Team POWERPUFFS
Developed during the SATWA 2026 Hackathon
Theme: Engineering Resilience – Designing for Uncertainty

Setup Instructions
# Clone the repository
git clone https://github.com/your-username/aidly.git

# Install dependencies
npm install

# Start the application
npm start
Contributing

Contributions are welcome. Please fork the repository, raise issues, and submit pull requests for improvements.

License

This project is licensed under the MIT License.
