# Training project template user guide

## Prerequisite
- NodeJS: [Download here](https://nodejs.org/en/download/)
- Visual studio code: [Download here](https://code.visualstudio.com/)
- Git for windows 64-bit: [Download here](https://git-scm.com/download/win)

## Work with repository
- Create your own github account
- Fork this repository to your account repository
- Clone project repository from your account to local
- Open visual studio code or command prompt
- Navigate to local repository
- Run cmd "npm install" in vscode terminal or command prompt
- After npm install run successful, run cmd "npm start" to start compiling and bundling js and scss files.

### Notes
- File without prefix underscore "_" are public files (Example: home-page.ts, home-page.scss). Webpack **only** transpile these files to js or css in "dist" folder.
- Files with prefix underscore "_" are internal files. These files are imported in public file. Webpack is **not** transpile these files to js or css in "dist" folder.
- This project is using ESlint with Airbnb JavaScript Style Guide for checking consistent of coding convention. More info about Airbnb JavaScript Style Guide [here](https://github.com/airbnb/javascript)

# Code Review: 
## 11/03/2026
- Don't have to validate on the read-side
- Over-engineered code on rendering UI