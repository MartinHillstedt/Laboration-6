"use strict";
/*
 * Laboration 6 - Receptsökaren
 * Namn: Martin Nilsson
 */

// Hämtar element från DOM.
const errorSection = document.querySelector("#error");
const searchForm = document.querySelector("#searchform");
const searchInput = document.querySelector("#search");
const messageSection = document.querySelector("#message");
const recipeSection = document.querySelector("#recipe");

/**
 * Validerar formuläret, ger ett felmeddelande om sökfältet är tomt, annars rensas det från felmeddelanden.
 * @returns {boolean} true om man angivit ett sökord, annars false.
 * @param {string} searchPhrase - sökordet man angivit.
 */
function validateSearch(searchPhrase) {
  errorSection.textContent = "";

  if (searchPhrase === "") {
    errorSection.textContent = "Du måste ange ett sökord.";
    return false;
  }
  return true;
}

/**
 * Hanterar formuläret, validerar sökordet, hämtar receptet från API:t och
 *  renderar det första receptet som en array eller ger ett felmeddelande.
 */
searchForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const searchPhrase = searchInput.value.trim();

  if (validateSearch(searchPhrase)) {
    messageSection.textContent = "";

    recipeSection.innerHTML = "";

    try {
      const data = await fetchRecipe(searchPhrase);

      if (data.recipes.length === 0) {
        messageSection.textContent =
          "Inget recept kunde hittas, prova en annan sökfras.";
      } else {
        const recipeArray = data.recipes;

        renderRecipe(recipeArray[0]);
      }
    } catch (error) {
      console.error(error);
      messageSection.textContent = "Något gick fel vid hämtningen. Försök igen senare.";
    }
  }
});

/**
 * Asynkron funktion som inväntar hämtning av receptets data från en API som .JSON och
 * kastar ett fel om servern svarar med en felkod eller om hämtningen misslyckas.
 * @returns {Promise<Object>} Ett objekt med en array <recipes>, som är tom om inget hittades.
 * @param {string} searchPhrase - sökfrasen man anger till API:t.
 */
async function fetchRecipe(searchPhrase) {
  try {
    const response = await fetch(
      `https://dummyjson.com/recipes/search?q=${searchPhrase}`,
    );

    if (!response.ok) {
      throw new Error(
        `Tyvärr blev det ett fel, servern svarade med: ${response.status}`,
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Hämtningen misslyckades, försök igen senare.", error);
    throw error;
  }
}

/**
 * Renderar recept i DOM samt ersätter eventuellt tidigare recept.
 * @param {Object} recipe - receptobjektet från API:t.
 */
function renderRecipe(recipe) {
  recipeSection.innerHTML = "";

  const article = document.createElement("article");

  const title = document.createElement("h3");
  title.textContent = recipe.name;

  const image = document.createElement("img");
  image.src = recipe.image;
  image.alt = recipe.name;

  const info = document.createElement("div");
  info.classList.add("recipe-info");
  info.appendChild(createInfoParagraph("Servings:", recipe.servings));
  info.appendChild(
    createInfoParagraph("Prep time:", `${recipe.prepTimeMinutes} minutes`),
  );
  info.appendChild(
    createInfoParagraph("Cooking time:", `${recipe.cookTimeMinutes} minutes`),
  );
  info.appendChild(createInfoParagraph("Difficulty:", recipe.difficulty));

  const ingredientsHeader = document.createElement("h4");
  ingredientsHeader.textContent = "Ingredients";

  const ingredientsList = createList(recipe.ingredients, "ul");

  const instructionsHeader = document.createElement("h4");
  instructionsHeader.textContent = "Instructions";

  const instructionsList = createList(recipe.instructions, "ol");

  article.append(
    title,
    image,
    info,
    ingredientsHeader,
    ingredientsList,
    instructionsHeader,
    instructionsList
  );

  recipeSection.appendChild(article);
}

/**
 * Funktion som skapar ett HTML-element i form av ett stycke med fetstilad etikett följt av ett värde.
 * @param {string} label - etiketten på värdet från arrayen, t.ex. servings: eller prep time:.
 * @param {string|number} value - värdet som visas efter etiketten.
 * @returns {HTMLParagraphElement} - stycket med label och value.
 */
function createInfoParagraph(label, value) {
  const paragraph = document.createElement("p");

  const strong = document.createElement("strong");

  strong.textContent = label;

  paragraph.append(strong, ` ${value}`);

  return paragraph;
}

/**
 * Funktion som skapar en lista beroende på listtyp med ett li-element för varje post.
 * @param {string[]} items - anger vilka texter som ska bli listpunkter.
 * @param {string} listType - listtyp, numrerad eller punktlista.
 * @returns {HTMLElement} - det färdigformaterade listelementet.
 */
function createList(items, listType) {
  const list = document.createElement(listType);

  items.forEach(function (item) {
    const listItem = document.createElement("li");
    listItem.textContent = item;
    list.appendChild(listItem);
  });

  return list;
}
