"use strict";
/*
 * Laboration 6 - Receptsökaren
 * Namn: Martin Nilsson
 */

// Hämtar element från DOM 
const errorSection = document.querySelector('#error');
const searchForm = document.querySelector('#searchform');
const searchInput = document.querySelector('#search');
const messageSection = document.querySelector('#message');
const recipeSection = document.querySelector('#recipe');

/*
 * Validerar formuläret, ger ett felmeddelande om sökfältet är tomt, annars rensas det från felmeddelanden.
 * @returns {boolean} true om man angivit ett sökord, annars false.
 */
function validateSearch(searchPhrase) {
    
    errorSection.textContent = ""; 
    
    if (searchPhrase === "") {
        errorSection.textContent = "Du måste ange ett sökord."
        return false;

    } 
        return true;
    
}

//Anger om sökformulärets validering är godkänd eller misslyckad i konsolen.
searchForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const searchPhrase = searchInput.value.trim();

    if (validateSearch(searchPhrase)) {
        console.log('Validering godkänd! sökord:', searchPhrase);
    } else {
        console.log('Validering misslyckad.')
    }
    
});

//Asynkron funktion som inväntar hämtning av receptets data från en API som .JSON och kastar ett fel i konsolen om hämtningen misslyckas.
async function fetchRecipe() {
    try {
        const response = await fetch('https://dummyjson.com/recipes/search?q=');
        const data = await response.json();
        return data;

    } catch (error) {
        console.error ('Hämtningen misslyckades, försök igen senare.', error);
        throw error;   
            
    }

}
