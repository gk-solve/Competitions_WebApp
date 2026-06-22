COMPETITIONS WEBAPP

This web application displays and queries various sports competitions results: cycling, running and open-water swimming.

1) V0.1 is a prototype - a lightweight 3-tier monolith with:
     - a presentation layer coded in HTML, CSS, Javascript. No JS framework
     - a business logic layer, with JSON endpoints APIs written in PHP
     - a data layer made of a lightweight SQLite database
     - This version will run on a clustered server, executing SQLite and PHP.

2) V0.2 will be a shift to a more modern web app architecture (still in 3-tier):
     - a presentation layer coded in HTML, CSS, Javascript (React.js or Angular.js or Vue.js)
     - the business logic layer will include REST APIs instead of PHP JSON endpoints
     - the data layer will be migrated from SQLite to Azure SQL database
     - This more advanced version will run on a clustered server as well.