const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const API_KEY = 'f9a30f44675449908d900844b60de1e6'; // Replace with your Spoonacular API key

app.get('/', (req, res) => {
  res.send('Welcome to the Recipe Chatbot!');
});

app.post('/find-recipes', async (req, res) => {
  const userIngredients = req.body.ingredients.join(','); // Get the ingredients from the request and join them as a string
  const mealType = req.body.mealType; // Get the meal type from the request

  try {
    const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch`, {
      params: {
        apiKey: API_KEY,
        number: 20, // Fetch 20 recipes
        cuisine: 'Indian', // Filter for Indian cuisine
        type: mealType, // Filter for specified meal type
        includeIngredients: userIngredients // Include ingredients in the query
      }
    });

    const recipes = response.data.results;
    res.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ message: 'Error fetching recipes. Please try again later.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


