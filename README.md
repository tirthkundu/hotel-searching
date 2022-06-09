# Hotel searching
Backend task

The repo consists of below APIs:
- api/properties?at=LAT,LONG	 //Returns the property around Lat/Lon
- api/bookings	 //Creates a booking for a property.
- api/properties/PROPERTY_ID/bookings	 //Returns the bookings for a property



<b>Local Setup</b>
- Install [node](https://nodejs.org/en/).
- Clone the git repo: git clone https://github.com/tirthkundu/hotel-searching.git in your local working directory.
- Go to the `hotel-searching` directory.
- Run `npm install`.
- Run `npm install pm2 -g`.
- To run the application: `pm2 start pm2/pm2-development.json`.
- Access http://localhost:3005/apitest/ URL (the static web page) to test the APIs or you can test using postman(the more elegant way) which is explained in the documentation.


<b>Hosting</b>

The code is hosted on EC2 and the URL to access it is:
http://ec2-3-134-98-150.us-east-2.compute.amazonaws.com:3005/apitest


<b>Documentation</b>

Go to the link below to get the access to the API documentation and API testing play ground:
https://documenter.getpostman.com/view/10563214/SzKZtGct

<b>Data Model</b>

https://github.com/tirthkundu/hotel-searching/blob/master/db/dbQueries.sql


<b>Scripts</b>

 - To run tests: Run `npm test`  // Executes test cases
 - To run linting: Run `npm run lint`  // Lints the file and find out unused/ undeclared variables.
 - To run prettier: Run `npm run pretty` // Prettify the files with desired indentation and spacing.


