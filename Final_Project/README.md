## Documentation
For this I used the nodeJS framework along with firebase for backend functions and a server-side .env file for security. The hardest part of this was getting started because when creating a backend system it feels overwhelming to get started. Once I got started though it became easier but making typos and addressing arrays incorrectly was really hard. In the end I was able to create a backend system that could support multiple accounts along with creating basic sign up features. 

## Missing ENV Variables
For security reasons I cannot post my env variables here but this is how the .env should be formatted in the root directory 
MAP_API_KEY='YOUR GOOGLE MAPS API KEY'
FIREBASE_API_KEY='YOUR FIREBASE API KEY'
DEBUG_EMAIL="EMAIL TO ACCESS EVERYTHING"


## Create
When on create screen, click places on the map where you want to push a location. You can click on the location within the list to rename them. Click the trash bins to delete the locations. Click and drag on the map to go to different places. 

For routes you can do the same actions as location. Click the plus sign to add a new route. Click on the edges of the route button to switch which route to display.

## Explore 
When on explore screen all routes that are currently on the server show up. Click on the actual map of the route to get redirected to it on a different tab. 

## Sign Up 
Not in commission right now but can be implemented by creating new documents with the current user schema. 

## FIREBASE FORMAT
Final-Project-Users
- User
    - created (array)
        - 0 
            - likes: 0 
            - locations: (array)
            - name: 
        - 1 
            - likes: 0 
            - locations: (array)
            - name: 
    - liked (array)
        - link1
    - password:

## Link to the presentation ##
https://docs.google.com/presentation/d/1KaJIA4p_QzgCcYkbzVT42laf4n6PnUY6MPNP-F3kE0A/edit?usp=sharing 