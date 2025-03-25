
<h1>Welcome to the Velvet Room!</h1>
 
The Velvet Room App is a full-stack application. Based off a key component in the Persona video game series. This is a reconstructed version of it meant for the web as a collection game.

Summon personas and then fuse them to get new personas. Buy previously owned personas from the compendium. Try out the special fusions for a challenge.

Users can sign up, login and keep their progress. If you would like to try a different Wildcard, you can make a new account for replayability. 

Built with a Flask backend and React frontend, it integrates tools such as UseContext for state management and dnd kit core for drag and drop. 

<h1>Preview</h1>

Wildcard Selection Page:
![image](https://github.com/user-attachments/assets/6871ddb3-bb20-476c-b2ac-61a6f46fc0c6)

Home Page:
![image](https://github.com/user-attachments/assets/f2d06a9d-97cc-4209-9809-8906ad834d62)

Stock Page:
![image](https://github.com/user-attachments/assets/8586f016-5588-4a6f-8dc7-a3f3b10395e3)

Summon Page:
![image](https://github.com/user-attachments/assets/77d8b76c-34a3-4c6e-a38e-4b10208acc23)

Fusion Page:
![image](https://github.com/user-attachments/assets/4c2e53f9-7bb4-4b73-a7d1-727c7a12e7c1)

Special Fusion Page:
![image](https://github.com/user-attachments/assets/775771d0-9e04-484a-ad83-52eaac37e27e)

Compendium Page:
![image](https://github.com/user-attachments/assets/b9d70278-ec7a-4648-b7d6-fa61df6e64f0)

Update Profile:
![image](https://github.com/user-attachments/assets/35905efe-062a-4359-80e1-4bd00d139ef3)



<h1>Demo Video:</h1>
https://www.loom.com/share/17c85a4af497494ba2e3f6363b09f170?sid=583a719c-5030-4dd7-8ca6-1eb629e8916c











<h1>Set Up</h1>

<h2>Frontend</h2>

Clone the Repository: 
       
	   git clone git@github.com:nemswirls/the-velvet-room.git 
	   
	   cd the-velvet-room/client
Install Dependencies:
        
		npm install 

Run the frontend:
 
        npm run dev 

<h2>Backend</h2>

Navigate to Backend Directory:
        
		 cd ../server

Set Up Virtual Environment:
        
		pipenv install
         pipenv shell
Seed the database:
      
		python seed.py (doing this adds the database to your local machine but entering again after making progress in the game will delete all progress so keep note of this)
Run the Backend:
      
	     python app.py

<h1>What's Next?</h1>

New personas added 

New wildcards as new persona games release



