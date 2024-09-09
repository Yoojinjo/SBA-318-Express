working idea to do some sort of inventory system.
tentatively a rental shop. (decided to limit to clothing category for now)

functions add items to inventory list, remove items, and update customer of item
info and buttons created dynamically each item

for rent, require choosing a customer in order to submit rent action
renting item will use CSS to change button color and disable rent button, until it is marked as returned
return button will undo the rent status. and the last customer

can create new items, error handling to prevent empty fields and reusing an existing item id.
if an entry is rejected, error message displays reason why. Fields are retained, so that user does not need to refill everything.

can edit an item properties. if item is edited to lost status, then item return button is disabled. (needs to also disable the rent button too tho.)

delete item button will generate an popup asking for confirmation

use ejs to handle views
data is stored as Json for this project, not actual database.

would like to have way to store, display and upload pictures of items in future
would like to implement a file to store history of changes to the inventory.
would like to create UI for adding customer data.

also try using eks for this project?

5% Create and use at least two pieces of custom middleware.
5% Create and use error-handling middleware.
5% Use at least three different data categories (e.g., users, posts, or comments).
5% Utilize reasonable data structuring practices.
5% Create GET routes for all data that should be exposed to the client.
5% Create POST routes for data, as appropriate. At least one data category should allow for client creation via a POST request.
5% Create PATCH or PUT routes for data, as appropriate. At least one data category should allow for client manipulation via a PATCH or PUT request.
5% Create DELETE routes for data, as appropriate. At least one data category should allow for client deletion via a DELETE request.
5% Include query parameters for data filtering, where appropriate. At least one data category should allow for additional filtering through the use of query parameters.
5% Utilize route parameters, where appropriate.
10% Adhere to the guiding principles of REST.
8% Create and render at least one view using a view template and template engine. This can be a custom template engine or a third-party engine.
2% Use simple CSS to style the rendered views.
3% Include a form within a rendered view that allows for interaction with your RESTful API.
5% Utilize reasonable code organization practices.
10% Ensure that the program runs without errors (comment out things that do not work, and explain your blockers - you can still receive partial credit).
5% Commit frequently to the git repository.
2% Include a README file that contains a description of your application.
5% Level of effort displayed in creativity, presentation, and user experience.
