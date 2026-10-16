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

/**
 * Validerar formuläret, ger ett felmeddelande om sökfältet är tomt, annars rensas det från felmeddelanden.
 * @returns {boolean} true om man angivit ett sökord, annars false.
 * @param {string} searchPhrase
 */
function validateSearch(searchPhrase) {
    
    errorSection.textContent = ""; 
    
    if (searchPhrase === "") {
        errorSection.textContent = "Du måste ange ett sökord.";
        return false;

    } 
        return true;
    
}

//Hanterar formuläret, hämtar data från API och lyssnar på sökordet. 
searchForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const searchPhrase = searchInput.value.trim();

    messageSection.textContent ="";
    recipeSection.innerHTML = "";

    if (validateSearch(searchPhrase)) {
        
        try {
            
            const data = await fetchRecipe (searchPhrase);
        
        if (data.recipes.length === 0 ) {
        messageSection.textContent = "Inget recept kunde hittas, prova en annan sökfras.";
        } else {

            const recipeArray = data.recipes;

            console.log(recipeArray);
            renderRecipe(recipeArray[0]);
        }
        } catch (error) {
            messageSection.textContent = "Något gick fel vid hämtningen.";
    }
    
}
}); 

/**
 * Asynkron funktion som inväntar hämtning av receptets data från en API som .JSON och kastar ett fel i konsolen om hämtningen misslyckas.
 * @returns {Promise<Object>} 
 * @param {string} searchPhrase
 */ 
async function fetchRecipe(searchPhrase) {
    try {
        const response = await fetch(`https://dummyjson.com/recipes/search?q=${searchPhrase}`);
        
        if (!response.ok) {
            throw new Error(`Tyvärr blev det ett fel, servern svarade med: ${response.status}`);
        }     
        const data = await response.json();
        return data;
           
    } catch (error) {
        console.error ('Hämtningen misslyckades, försök igen senare.', error);
        throw error;   
            
    }

}

function renderRecipe(recipe) {
    
    recipeSection.innerHTML = "";

    const article = document.createElement ("article");

    const title = document.createElement ("h3");
    title.textContent = recipe.name;

    const image = document.createElement ("img");
    image.src = recipe.image;
    image.alt = recipe.name;

    const info = document.createElement ("div");
    info.classList.add("recipe-info");
    info.appendChild(createInfoParagraph("Servings:", recipe.servings));
    info.appendChild(createInfoParagraph("Prep time:", `${recipe.prepTimeMinutes} minutes`));
    info.appendChild(createInfoParagraph("Cooking time:", `${recipe.cookTimeMinutes} minutes`));
    info.appendChild(createInfoParagraph("Difficulty:", recipe.difficulty));

    article.append(
        title,
        image,
        info,
    );

    recipeSection.appendChild (article);

}     

function createInfoParagraph(label, value) {
    
    const paragraph = document.createElement("p");

    const strong = document.createElement("strong");

    strong.textContent = label;

    paragraph.append(strong, `${value}`);

    return paragraph;

}


    

    

