# YelpCamp

# YelpCamp

## Key Features

- Header
  - Home
  - Campgrounds
  - Add Campgrounds (Need authentication)
  - Login (When not signed in)
  - Register (When not signed in)
  - Logout (After signed in)
- Home (/)
  - Header
  - View Campgrounds Button (routes to /campgrounds)
- Login (/login)
  - Header
  - Login Form
  - Perform authentication (display error flash card if needed)
  - Redirect to (/campgrounds) once Logged in successfully (with flash card "Welcome back!")
- Register (/register)
  - Header
  - Register Form
  - Redirect to (/campgrounds) once Signed in successfully (with flash card "Welcome to Yelp Camp!")
- Logout (/logout)
  - logout user
  - Redirect to (/campgrounds) (with flash card "Successfully Logged out")
- Campgrounds (/campgrounds)
  - Header
  - World Map with all the Campgrounds in Cluster View
  - Campground Basic Info Card
    - Campground Thumbnail Image (first image)
    - Campground Title / Description / Location
    - Campground View Button
      - Redirect to (/campgrounds/:campgroundId)
- View Campground Page (/campgrounds/:campgroundId)
  - Header
  - Left Card
    - Campground Images Carousel
    - All the Campground Info
    - Edit Campground Button (only displayed if user created this campground)
    - Delete Campground Button (only displayed if user created this campground)
  - Right Card
    - Map to display Location for that campground
      - Pin Icon (Clickable)
        - Once clicked a new tab of Google Maps with the current location for that campground is created
    - Leave a Review Form (only displayed if authenticated)
      - Select 1-5 stars (3 stars by default)
      - Add the review text and submit
    - Show Current Reviews
      - Reviewer Name / Review Text / 1-5 Stars
- Edit Campground Page (campgrounds/:campgroundId/edit)
  - Header
  - Edit form to edit the info
  - Return to campground button (redirect to (campgrounds/:campgroundId) without any edits)
  - Edit the campground button (completes the edit and redirect to (campgrounds/:campgroundId) (with flash card "Successfully updated campground ${campground-name}")
  - Note: Edit Internal-Logic for Image upload:
    - A campground can have atmost 3 images
    - If there are some current images for that campground
      - user need to select the images to be removed among the current ones and upload new images
      - The total images which were not removed + which were uploaded must not exceed 3
  - If the above condition is not satisfied, the edit button will be disabled
- Delete Campground Page (campgrounds/:campgroundId/delete)
  - Delete the campground and redirect to (/campgrounds) (with flash card "Successfully deleted")

## Key Features

- Home
- Login / Sign Up
  - Sign in / Sign Up Form
  - Redirect to Browse Page once Logged in
- Browser Page (After Authentication)
  - Header
  - Main Movie
    - Trailer in Background
    - Title and Description
    - Movie Suggestions
      - Movie Lists * n
- Netflix GPT
  - Search Bar
  - Movie Suggestions
