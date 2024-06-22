-- This block inserts a new user into the account table with the first name Tony, last name Stark, email address tonystark@starkent.com, and password Iam1ronM@. The account type is set to Admin.
INSERT INTO public.account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@'
    );

    
-- This block updates the account type of the user with the first name Tony and last name Stark to Admin.
UPDATE public.account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony'
    AND account_lastname = 'Stark';


-- This block updates the description of the vehicle with the make GM and model Hummer to replace the word 'small interiors' with 'a huge interior'.
UPDATE public.inventory
SET inv_description = REPLACE(
        inv_description,
        'small interiors',
        'a huge interior'
    )
WHERE inv_make = 'GM'
    AND inv_model = 'Hummer';


-- This block selects all information from the inventory table joined with the classification table on the classification_id field, and returns all rows where the classification name is 'Sport'.
-- Returns:
--  inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, classification_name
SELECT *
from public.inventory
    INNER JOIN public.classification ON public.inventory.classification_id = public.classification.classification_id
WHERE public.classification.classification_name = 'Sport';

-- Updates the inv_image and inv_thumbnail columns of the inventory table.
-- Replaces '/images' with '/images/vehicles' in the values of these columns.
-- This is done to ensure that the image and thumbnail paths are correct for the new directory structure.
UPDATE public.inventory
	SET 
		-- Replaces '/images' with '/images/vehicles' in the values of the inv_image column.
		inv_image = REPLACE(inv_image, '/images', '/images/vehicles'),
		-- Replaces '/images' with '/images/vehicles' in the values of the inv_thumbnail column.
		inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles')
	-- Updates rows where the inv_image and inv_thumbnail columns contain '/images'.
	WHERE inv_image LIKE '%/images%' OR inv_thumbnail LIKE '%/images%';
