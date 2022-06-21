# just-another-social-network

## Impressions


## Overview
Just Another Social Network is a web app comparable to Facebook or LinkedIn with instantaneous global and private chat functions.

## Features

### Register/Login
- Users can register and log in. User accounts are linked to unique e-mail addresses.
- Password reset with crypto-random-string and AWS SES.

### Profile
- Users can upload a profile image. Uploaded images stored with AWS S3.
- Users can set, change or delete a 140 character bio and add one link to the Bio component. Link is represented as an icon for other users. 

### Friends
- Search for other users within the Friends component. Search loops through the global database of users and instantly returns the top 3 entries matching query.
- The Friends component also includes existing lists of Friends and Requests, stored in state using Redux.

### Global & Private Chat
- A Global Chat component is embedded on the Home Page. The chat is populated on load via Redux and new chat messages are instantly served using Socket.IO.
- Each chat message includes the sender's profile picture and name. The profile pic links to their profile page.
- Private Chat Function is also available.

### Other Users Profiles
- Users profile picture, name, bio, and link are publicly available to all.
- A button in the Bio component allows users to Add Friend, Unfriend, or Cancel Request. This behavior is handled via Redux and reflected in the Friends page.
