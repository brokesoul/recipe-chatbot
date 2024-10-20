document.addEventListener('DOMContentLoaded', () => {
    // Function to fetch recipes based on meal type and selected cuisine
    async function fetchRecipes(mealType, cuisine, ingredients = []) {
        try {
            const response = await fetch('http://localhost:3001/find-recipes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ingredients, mealType })
            });
            const data = await response.json();
            displayRecipes(data);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Function to display recipes in the chatbox
    function displayRecipes(recipes) {
        const chatbox = document.getElementById('chatbox');
        chatbox.innerHTML = ''; // Clear previous recipes

        if (recipes.length === 0) {
            chatbox.innerHTML = '<p class="no-recipe">No recipes found with these ingredients.</p>';
        } else {
            recipes.forEach(recipe => {
                const recipeTitle = recipe.title || "Recipe Title Not Available";
                const recipeImage = recipe.image || 'https://via.placeholder.com/350';
                const recipeLink = `https://spoonacular.com/recipes/${encodeURIComponent(recipeTitle)}-${recipe.id}`;

                chatbox.innerHTML += `
                    <div class="recipe-card">
                        <a href="${recipeLink}" target="_blank">
                            <img src="${recipeImage}" alt="${recipeTitle}" class="recipe-image">
                        </a>
                        <h2>${recipeTitle}</h2>
                    </div>
                `;
            });
        }
        chatbox.scrollTop = chatbox.scrollHeight; // Scroll to the latest message
    }

    // Event listeners for meal buttons
    document.querySelectorAll('.meal-button').forEach(button => {
        button.addEventListener('click', function() {
            const mealType = this.getAttribute('data-meal');
            const selectedCuisine = document.getElementById('cuisineDropdown').value;
            const input = document.getElementById('ingredient-input').value;
            const ingredients = input.split(',').map(item => item.trim());

            // Fetch recipes based on the selected meal type, cuisine, and ingredients
            fetchRecipes(mealType, selectedCuisine, ingredients);
        });
    });

    // Optional: Add event listener for the Send button if you want it to also send requests
    const sendButton = document.getElementById('sendButton');
    if (sendButton) {
        sendButton.addEventListener('click', () => {
            const input = document.getElementById('ingredient-input').value;
            const ingredients = input.split(',').map(item => item.trim());

            const selectedMeal = document.querySelector('.meal-button.active');
            if (!selectedMeal) {
                alert("Please select a meal type before sending ingredients.");
            } else {
                const mealType = selectedMeal.getAttribute('data-meal');
                const selectedCuisine = document.getElementById('cuisineDropdown').value;
                fetchRecipes(mealType, selectedCuisine, ingredients);
            }
        });
    }
});
