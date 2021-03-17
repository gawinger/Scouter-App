# Scouter-App
Web application for visiting and exchanging information about tourist attractions.\ 

## Technologies
Project created with **javascript** and **bootstrap 5**.\
App uses a **MongoDB** with **Mongoose** to store data about users, reviews and spots.\

## Functionality
App allows logged in users to add new attractions and leave reviews and rate spots. Authentication is made with ** passport.js **. \
Images are being uploaded by multer and stored by Cloudinary. \
Each attraction has its own rating that is falling with every new rate. \
There are admin accounts that are able to delete reviews and spots. \
To the App, I added a cluster map showing location of every attraction in database. \
Site is secured for common security issues, additionally, it uses helmet.js.

View live: https://scouter.bartoszczupryna.com/
