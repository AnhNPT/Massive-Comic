Open the folder in Visual Studio Code. Install the Live Server extension. Right-click on the index.html file and select "Open with Live Server".

Since each machine running Live Server will have a different path and port, please check the local path when running. If it's incorrect, follow these steps to fix it:

Open the junction.js file (inside the js folder) and scroll down to the end where you will find the getPathName() function. Change the existing domain to match your browser's domain.

For example, if you're running locally with the domain http://127.0.0.1:8080/, then change http://127.0.0.1:5500/ to http://127.0.0.1:8080/ (make sure to include the trailing "/").

Save the file and refresh your browser (press F5).
