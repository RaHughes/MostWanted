"use strict"


//Menu functions.
//Used for the overall flow of the application.
/////////////////////////////////////////////////////////////////
//#region 

// app is the function called to start the entire application
function app(people){
  let searchType = promptFor("Do you know the name of the person you are looking for? Enter 'yes' or 'no'", yesNo).toLowerCase();
  let searchResults;
  switch(searchType){
    case 'yes':
      searchResults = searchByName(people);
      if(searchResults.length === 0){
        alert("Could not find that individual.");
        return app(people); // restart
      }
        mainMenu(searchResults, people);
      break;
    case 'no':
      var attSwitch = prompt('Would you like to search for one, or many attributes?: One, Many').toLowerCase()
      if(attSwitch === 'one'){
        attributeMenu(people);
      }
      else if(attSwitch === 'many'){
        multipleAttributesMenu(people);
      }
      break;
      default:
    app(people); // restart app
      break;
  }
  
  // Call the mainMenu function ONLY after you find the SINGLE person you are looking for
  // mainMenu(searchResults, people);
}

// Menu function to call once you find who you are looking for
function mainMenu(person, people){

  /* Here we pass in the entire person object that we found in our search, as well as the entire original dataset of people. We need people in order to find descendants and other information that the user may want. */

  // if(!person){
  //   alert("Could not find that individual.");
  //   return app(people); // restart
  // }

  let displayOption = promptFor("Found " + person[0].firstName + " " + person[0].lastName + " . Do you want to know their 'info', 'family', 'parents', or 'descendants'? Type the option you want or 'restart' or 'quit'", autoValid);

  switch(displayOption){
    case "info":
    // TODO: get person's info
    alert(`          First Name: ${person[0].firstName}  \n 
           Last Name: ${person[0].lastName} \n
           Gender: ${person[0].gender} \n 
           Date of Birth: ${person[0].dob} \n
           Height: ${person[0].height} \n
           Weight: ${person[0].weight} \n
           Eye Color: ${person[0].eyeColor} \n
           Occupation: ${person[0].occupation}`)
    break;
    case "family":
    // TODO: get persons family
    var spouse = searchForSpouse(people, person[0].currentSpouse)
    var descendants = searchForDescendants(people, person[0].id)
    var parents = searchForParents(people, person[0].parents)
    alert(`${person[0].firstName}s Family:\nSpouse:\n${spouse}\nChildren:\n${descendants.join("\n")}\nParents:\n${parents.join("\n")}`)
    break;
    case "parents":
    var parents = searchForParents(people, person[0].parents)
    if(parents.length > 1){
      alert(`Parents \n
            ${parents[0]} \n 
            ${parents[1]}`)
    } else if(parents.length === 1) {
      alert(`Parents \n
            ${parents[0]}`)
    } else {
      alert('No parents on file.')
    }
    break;
    case "descendants":
    var descendants = searchForDescendants(people, person[0].id)
    if(descendants.length != 0) {
      alert(`${person[0].firstName}s Descendants: \n${descendants.join("\n")}`)
    } else {
      alert("No descendants")
    }
    break;
    case "restart":
    app(people); // restart
    break;
    case "quit":
    return; // stop execution
    default:
    return mainMenu(person, people); // ask again
  }
}

function attributeMenu(people){
  let displayOption = promptFor("What attribute would you like to search for?: 'Gender', 'Date of Birth', 'Height', 'Weight', 'Eye Color' ", autoValid).toLowerCase()

  switch (displayOption){
    case "gender":
    var genderInput = prompt("Which gender are you lookin for? Male or Female?: ").toLowerCase()
    var genderList = searchByAttribute(people, genderInput, "gender");
    var genderNames = []
    genderList.forEach(i => {
      var name = i.firstName + ' ' + i.lastName
      genderNames.push(name)
    })
    alert(genderNames.join("\n"))
    break;
    case "date of birth":
    var dobInput = prompt("Input the Date of Birth mm/dd/yyyy: ")
    var dobList = searchByAttribute(people, dobInput, "dob");
    var dobNames = []
    dobList.forEach(i => {
      var name = i.firstName + ' ' + i.lastName
      dobNames.push(name)
    })
    alert(dobNames.join("\n"))
    break;
    case "height":
    var heightInput = parseInt(prompt("How tall is who you are looking for in inches : "))
    var heightList = searchByAttribute(people, heightInput, "height");
    var heightNames = []
    heightList.forEach(i => {
      var name = i.firstName + ' ' + i.lastName
      heightNames.push(name)
    })
    alert(heightNames.join("\n"))
    break;
    case "weight":
    var weightInput = parseInt(prompt("How heavy is the person you are looking for in pounds?: "))
    var weightList = searchByAttribute(people, weightInput, "weight");
    var weightNames = []
    weightList.forEach(i => {
      var name = i.firstName + ' ' + i.lastName
      weightNames.push(name)
    })
    alert(weightNames.join("\n"))
    break;
    case "eye color":
    var eyeColorInput = prompt("Which eye color are you lookin for? Blue, Brown, Black, Green, Hazel?: ").toLowerCase()
    var eyeColorList = searchByAttribute(people, eyeColorInput, "eyeColor");
    var eyeColorNames = []
    eyeColorList.forEach(i => {
      var name = i.firstName + ' ' + i.lastName
      eyeColorNames.push(name)
    })
    alert(eyeColorNames.join("\n"))
    break;
    default:
      return attributeMenu(people);
  }
}

function multipleAttributesMenu(people){
  let allAtts = []
  let flag = false
  while(flag === false){
    let displayOption = prompt("Which attribute would you like to search by? 'Gender', 'Date of Birth', 'Height', 'Weight', 'Eye Color' ").toLowerCase()
    if (displayOption === 'date of birth') {
      displayOption = 'dob'
    }
    else if(displayOption === 'eye color') {
      displayOption = 'eyeColor'
    }
    allAtts.push(displayOption)
    let done = prompt('Would you like to add another attribute?: Yes or No').toLowerCase()
    if(done === 'no') {
      flag = true
    }
  }
  let filteredList = searchAllAttributes(people, allAtts)
  var filteredNames = []
    filteredList.forEach(i => {
      var name = i.firstName + ' ' + i.lastName
      filteredNames.push(name)
    })
    alert(filteredNames.join("\n"))
}
//#endregion

//Filter functions.
//Ideally you will have a function for each trait.
/////////////////////////////////////////////////////////////////
//#region 

//nearly finished function used to search through an array of people to find matching first and last name and return a SINGLE person object.
function searchByName(people){
  let firstName = promptFor("What is the person's first name?", autoValid).toLowerCase();
  let lastName = promptFor("What is the person's last name?", autoValid).toLowerCase();

  let foundPerson = people.filter(function(potentialMatch){
    if(potentialMatch.firstName.toLowerCase() === firstName && potentialMatch.lastName.toLowerCase() === lastName){
      return true;
    }
    else{
      return false;
    }
  })
  // TODO: find the person single person object using the name they entered.
  return foundPerson;
}

//unfinished function to search through an array of people to find matching eye colors. Use searchByName as reference.
function searchByAttribute(people, attribute, searchAttribute){
  let attributeList = [];
  people.forEach(person =>{
    if (person[searchAttribute] === attribute){
      attributeList.push(person)
    }
  })
  return attributeList
}

function searchAllAttributes(people, attList) {
  let inputList = []
  let counter = 0
  attList.forEach(attribute => {
    let input = prompt(`Please input data for ${attribute}: `)
    inputList.push(input)
  })
  let filteredPeople = []
    people.forEach(person => {
      if(person[attList[counter]] === inputList[counter]) {
        if(!(person in filteredPeople)) {
          filteredPeople.push(person)
        }
      }
    })
    counter++
    while(counter < (inputList.length)) {
      filteredPeople = filteredPeople.filter(person => person[attList[counter]] === inputList[counter])
      counter++
    }
  return filteredPeople
}


function searchForSpouse(people, spouse){
  var foundSpouse = '';
  people.forEach(i => {
    if (i.id === spouse) {
      foundSpouse = i.firstName + ' ' + i.lastName
    }
  })
  return foundSpouse
}

function searchForParents(people, parents) {
  let foundParents = []
  parents.forEach(i => {
    people.forEach(j => {
      if(i === j.id) {
        var parentName = j.firstName + ' ' + j.lastName
        foundParents.push(parentName)
      }
    })
  })
  return foundParents
}

function searchForDescendants(people, parentId) {
  let children = []
  people.forEach(person => {
    person.parents.forEach(id => {
      if(id === parentId) {
        var personName = person.firstName + ' ' + person.lastName
        children.push(personName)
      }
    })
  })
  return children
}

//#endregion

//Display functions.
//Functions for user interface.
/////////////////////////////////////////////////////////////////
//#region 

// alerts a list of people
function displayPeople(people){
  alert(people.map(function(person){
    return person.firstName + " " + person.lastName;
  }).join("\n"));
}

function displayPerson(person){
  // print all of the information about a person:
  // height, weight, age, name, occupation, eye color.
  let personInfo = "First Name: " + person.firstName + "\n";
  personInfo += "Last Name: " + person.lastName + "\n";
  // TODO: finish getting the rest of the information to display.
  alert(personInfo);
}

//#endregion



//Validation functions.
//Functions to validate user input.
/////////////////////////////////////////////////////////////////
//#region 

//a function that takes in a question to prompt, and a callback function to validate the user input.
//response: Will capture the user input.
//isValid: Will capture the return of the validation function callback. true(the user input is valid)/false(the user input was not valid).
//this function will continue to loop until the user enters something that is not an empty string("") or is considered valid based off the callback function(valid).
function promptFor(question, valid){
  let isValid;
  do{
    var response = prompt(question).trim();
    isValid = valid(response);
  } while(response === ""  ||  isValid === false)
  return response;
}

// helper function/callback to pass into promptFor to validate yes/no answers.
function yesNo(input){
  if(input.toLowerCase() == "yes" || input.toLowerCase() == "no"){
    return true;
  }
  else{
    return false;
  }
}

// helper function to pass in as default promptFor validation.
//this will always return true for all inputs.
function autoValid(input){
  return true; // default validation only
}

//Unfinished validation function you can use for any of your custom validation callbacks.
//can be used for things like eye color validation for example.
function customValidation(input){
  
}

//#endregion