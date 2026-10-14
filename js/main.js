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

function validateSearch(searchPhrase) {
    
    errorSection.textContent = ""; 
    
    if (searchPhrase === "") {
        errorSection.textContent = "Du måste ange ett sökord."
        return false;

    } 
        return true;

}

