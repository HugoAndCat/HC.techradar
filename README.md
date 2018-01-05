# HC.Boilerplate

##Getting Started

###Development Environment

You must have Node, Gulp and Typescript 2 installed globally.

**Install Node**
If you do not have nodeJS installed on your computer, click on the following link and install: 

	https://nodejs.org/en/download/stable/

**Install Gulp**
To install gulp command line globally

Run
    
    npm install -g gulp


**Install Typescript 2**
To install typescript 2 globally

Run

    npm install -g typescript@2.0


Run   

    npm install


To get intellisense for JS libraries 

    typings install


And then

    gulp


####Live Development

Run

    gulp watch
  

#### Local server
Run 
    npm run start



###Production Environment

Run

    npm install 

Then

    gulp --production



> NB: This will minify all css and JS and build everything to a dist folder ready for production

#Documentation

Run

    gulp docs

With the app running (through gulp watch) go to:

View SASSDocs http://[sitename]/docs/sass/  