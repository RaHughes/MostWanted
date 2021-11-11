"use strict"

function app(people){
  let searchType = promptFor("Do you know the name of the person you are looking for? Enter 'yes' or 'no'", yesNo).toLowerCase();
  let searchResults;
  switch(searchType){
    case 'yes':
      searchResults = searchByName(people);
      if(searchResults.length === 0){
        alert("Could not find that individual.");
        return app(people);
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
    app(people); 
      break;
  }  
}

function mainMenu(person, people){
  let displayOption = promptFor("Found " + person[0].firstName + " " + person[0].lastName + " . Do you want to know their 'info', 'family', 'parents', or 'descendants'? Type the option you want or 'restart' or 'quit'", autoValid);
  switch(displayOption){
    case "info":
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
    app(people);
    break;
    case "quit":
    return;
    default:
    return mainMenu(person, people);
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
  let allAttsNames = []
  let flag = false
  while(flag === false){
    let displayOption = prompt("Which attribute would you like to search by? 'Gender', 'Date of Birth', 'Height', 'Weight', 'Eye Color' ").toLowerCase()
    allAttsNames.push(displayOption)
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
  let filteredList = searchAllAttributes(people, allAtts, allAttsNames)
  var filteredNames = []
    filteredList.forEach(i => {
      var name = i.firstName + ' ' + i.lastName
      filteredNames.push(name)
    })
    alert(filteredNames.join("\n"))
}

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
  return foundPerson;
}

function searchByAttribute(people, attribute, searchAttribute){
  let attributeList = [];
  people.forEach(person =>{
    if (person[searchAttribute] === attribute){
      attributeList.push(person)
    }
  })
  return attributeList
}

function searchAllAttributes(people, attList, attNames) {
  let inputList = []
  let counter = 0
  attNames.forEach(attribute => {
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

function promptFor(question, valid){
  let isValid;
  do{
    var response = prompt(question).trim();
    isValid = valid(response);
  } while(response === ""  ||  isValid === false)
  return response;
}

function yesNo(input){
  if(input.toLowerCase() == "yes" || input.toLowerCase() == "no"){
    return true;
  }
  else{
    return false;
  }
}

function autoValid(input){
  return true; 
}
