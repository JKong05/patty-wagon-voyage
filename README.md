<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/JKong05/patty-wagon-voyage.git">
    <img src="/frontend/src/assets/pattywagon.png" alt="Logo" width="1080" height="360">
  </a>
</div>

<!-- ABOUT THE PROJECT -->

## About The Project
This was a coding challenge for Vanderbilt's Change Plus Plus student organization, which entailed developing a 
geography-based trivia game in your own style. The only conditions of the project were that the questions or trivia
be related to geography. I had the brilliant idea to then base it off of the Spongebob movie because as I was trying to
come up with ideas for a concept at 3:00 AM, I was watching clips of the movie on YouTube.

## Tech Stack
![My Skills](https://skillicons.dev/icons?i=mongodb,express,react,nodejs)

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites
Initialize npm if you have not already
- npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/JKong05/patty-wagon-voyage.git
   ```
2. cd into backend and install NPM packages
   ```sh
   cd backend
   npm install
   cd ..
   ```
3. cd into frontend and install NPM packages
   ```sh
   cd frontend
   npm install
   ```
4. create .env in backend directory and create environment variables
  - A mongoDB database is not required for the program
   ```sh
   API_KEY=YOUR-GOOGLE-GEMINI-API-KEY
   URI=YOUR-MONGODB-DATABASE-ACCESS KEY
   SECRETKEY=GENERATE-SECRET-KEY-FOR-COOKIES
   ```
5. Change git remote url to avoid accidental pushes to base project
   ```sh
   git remote set-url origin github_username/repo_name
   git remote -v # confirm the changes
   ```

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
