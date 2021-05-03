window.addEventListener("DOMContentLoaded", (event) => {
  const searchField = document.getElementById("search");
  const submitBtn = document.getElementById("submitBtn");
  const listTemplate = document.querySelector(".clone-list");
  const sections = document.querySelectorAll("section");
  const detailsPage = document.getElementById("details-page");
  const radioGroup = document.getElementById("radio-filters");
  const radioButtonArray = radioGroup.querySelectorAll("input");
  const hmeBtn = document.getElementById("homeBtn");
  let setChecked = (radioButtonArray[0].checked = true);
  searchField.value = "";

  let shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  // Button to show launch-list section and initialise launch list
  let goHome = () => {
    hmeBtn.addEventListener("click", function (e) {
      let sectionContainer = document.getElementById("launch-list");
      toggleSections(sectionContainer.id);
      loadLaunchList(setChecked);
      hmeBtn.classList.add("hidden");
    });
  };
  // Hide/ Show the selected section
  let toggleSections = (s) => {
    // s = the section id
    togglePendingState();
    for (let section of sections) {
      console.log(section.id);
      if (section.id === s) {
        setTimeout(function () {
          section.classList.remove("hidden");
        }, 3000);
      } else {
        section.classList.add("hidden");
      }
    }
  };
  // search bar interaction
  let searchBar = () => {
    // Search bar
    submitBtn.addEventListener("click", function (e) {
      e.preventDefault();

      let value = searchField.value.toLowerCase();
      console.log(value);
      let configurationObject = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query: {
            $text: {
              $search: value,
            },
          },
        }),
      };
      console.log(configurationObject);
      return fetch(
        "https://api.spacexdata.com/v4/launches/query",
        configurationObject
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (object) {
          console.log(object);
          renderSearch(object, value);
        })
        .catch(function (error) {
          console.log("Not working", error);
        });
    });
  };
  // Fetch Payload of ID
  let fetchPayload = (uid) => {
    // Empty array
    return fetch(`https://api.spacexdata.com/v4/payloads/${uid}`)
      .then(function (response) {
        return response.json();
      })
      .then(function (object) {
        let payLoads = object;
        return payLoads;
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  // Fetch Crew of ID
  let fetchCrew = (uid) => {
    return fetch(`https://api.spacexdata.com/v4/crew/${uid}`)
      .then(function (response) {
        return response.json();
      })
      .then(function (object) {
        let payLoads = object;
        return payLoads;
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  //Show search results based on search fetch results
  let renderSearch = (array, string) => {
    let sectionContainer = document.getElementById("search-results");
    let imgList = sectionContainer.querySelector(".img-container");
    let launches = array.docs;
    let searchPlayback = document.querySelector(".search-result-playback");

    // Clear launches
    imgList.innerHTML = "";
    searchField.blur();
    searchField.value = "";

    // Show relevant section
    toggleSections(sectionContainer.id);

    //Show Home button
    hmeBtn.classList.remove("hidden");

    // Playback users search in the results heading
    searchPlayback.innerHTML = string;
    console.log(searchPlayback);
    // If more than 1 result
    if (launches.length > 0) {
      renderList(launches, imgList);
    } else {
      console.log("empty");
    }
  };
  // Render List of Launches
  let loadLaunchList = (radioValue) => {
    let url = `https://api.spacexdata.com/v4/launches/past`;
    return fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (object) {
        let sectionContainer = document.getElementById("launch-list");
        let imgList = sectionContainer.querySelector(".img-container");
        //Check if all objects have img srcs
        let launches = object.filter((el) => {
          return el.links.flickr.original.length !== 0;
        });
        return renderList(sortArray(launches, radioValue), imgList);
      })
      .catch(function (error) {
        console.log("Not working", error);
      });
  };
  // On radio selection render array
  let onSelectRenderArray = () => {
    const radioGroup = document.getElementById("radio-filters");
    const radioButtonArray = radioGroup.querySelectorAll("input");

    for (let button of radioButtonArray) {
      button.addEventListener("click", function (e) {
        togglePendingState();
        if (radioButtonArray[0].checked) {
          // console.log("radioButtonArray[0].checked");
          let a = radioButtonArray[0].checked;
          return loadLaunchList(a);
        } else if (radioButtonArray[1].checked) {
          // console.log("radioButtonArray[1].checked");
          let b = radioButtonArray[1].checked;
          return loadLaunchList(b);
        } else if (radioButtonArray[2].checked) {
          // console.log("radioButtonArray[2].checked");
          let c = radioButtonArray[2].checked;
          return loadLaunchList(c);
        } else {
          return false;
        }
      });
    }
  };
  // function to sort an array by certain criterias
  let sortArray = (array, radioValue) => {
    const launchObject = array;
    // on page load order return array
    let decideSortType = () => {
      // If option 0 is selected randomize the order of the array
      if (radioValue === radioButtonArray[0].checked) {
        let randomOrder = shuffle(launchObject).slice(0, 24);
        return randomOrder.slice(0, 10);
      } else if (radioValue === radioButtonArray[1].checked) {
        let flightNumber = launchObject.sort((a, b) => {
          if (a.flight_number > b.flight_number) {
            return -1;
          }
          if (a.flight_number < b.flight_number) {
            return 1;
          }
          return 0;
        });
        return flightNumber.slice(0, 10);
      } else if (radioValue === radioButtonArray[2].checked) {
        console.log("3 is working");
        let alphabeticalorder = launchObject.sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });
        return alphabeticalorder.slice(0, 10);
      } else {
        let randomOrder = shuffle(launchObject).slice(0, 24);
        return randomOrder.slice(0, 10);
      }
    };
    return decideSortType();
    // console.log(decideSortType())
  };
  // Render each list element with launch data in the launch list section
  let renderList = (array, imgContainer) => {
    setTimeout(function () {
      // iterate over the array of launches
      for (launch of array) {
        let imgPath = shuffle(launch.links.flickr.original);
        let cloneList = listTemplate.cloneNode(true);
        cloneList.classList.remove("hidden");
        imgContainer.append(cloneList);
        let img = cloneList.querySelector(".img-tiles");
        let heading = cloneList.querySelector(".list-item-heading");
        let button = cloneList.querySelector("button");

        // Add correct hover effect for status of launch
        if (launch.success === true) {
          button.classList.add("success");
        } else {
          button.classList.add("failure");
        }

        // Add image source and Heading
        img.src = imgPath;
        heading.innerText = `${launch.name}`;
        let launchDetails = launch;
        let payloadDetails = launch.payloads;
        console.log(payloadDetails);

        // Add on click event for list to each launch
        button.addEventListener("click", function (e) {
          console.log(launchDetails);
          togglePendingState();
          renderInfoPage(launchDetails, payloadDetails);
        });
      }
    }, 3000);
  };
  // Update timestamp to readable dates
  let readableDates = (date) => {
    // US format
    let newDate = date.slice(0, 10);
    return newDate;
  };
  // Function to toggle the pending state / loading bar
  let togglePendingState = () => {
    const slider = document.getElementById("slider");
    slider.classList.remove("hidden");
    setTimeout(function () {
      slider.classList.add("hidden");
    }, 3000);
  };
  // Render information page
  let renderInfoPage = (info, payload) => {
    // Clear search bar
    searchField.value = "";
    //Show Home button
    hmeBtn.classList.remove("hidden");

    // Show relevant section
    toggleSections(detailsPage.id);

    const imgList = detailsPage.querySelector(".img-container");
    const heading = detailsPage.querySelector("h2");
    const summary = detailsPage.querySelector("p");
    const date = detailsPage.querySelector(".date");
    const flightNumber = detailsPage.querySelector(".flight-number");
    const statusIndicator = detailsPage.querySelector(".launch-success");
    const informationCard = detailsPage.querySelector(".information-card");
    const articleLink = informationCard.querySelector("a.article-link");
    const pressKitLInk = informationCard.querySelector("a.presskit-link");
    const youtubeLink = informationCard.querySelector("a.youtube-link");

    // Check if launch was successful or failure and apply correct styling
    if (info.success === true) {
      statusIndicator.innerHTML = "Success";
      statusIndicator.classList.remove("failure");
      flightNumber.classList.remove("failure");
      statusIndicator.classList.add("success");
      flightNumber.classList.add("success");
    } else {
      statusIndicator.innerHTML = "Failure";
      flightNumber.classList.remove("success");
      statusIndicator.classList.remove("success");
      statusIndicator.classList.add("failure");
      flightNumber.classList.add("failure");
    }

    // Populate Heading and Summary
    heading.innerText = `${info.name}`;
    summary.innerText = `${info.details}`;
    date.innerHTML = readableDates(`${info.date_local}`);
    flightNumber.innerHTML = `Flight #${info.flight_number}`;

    // Populate Links
    articleLink.href = info.links.article;
    pressKitLInk.href = info.links.presskit;
    youtubeLink.href = info.links.webcast;

    // Photos Array
    let photos = info.links.flickr.original;

    imgList.innerHTML = "";
    // Populate photos
    for (let photo of photos) {
      let img = document.createElement("img");
      img.src = photo;
      imgList.append(img);
    }
    // Create crew array
    let crewArray = info.crew;
    checkCrew(crewArray);
    // Load Paylaod
    loadPayload(payload, informationCard);
    loadCrew(crewArray, informationCard);
  };
  // Add accordion interaction
  let accordionInteraction = (button) => {
    button.addEventListener("click", function (e) {
      console.log("working");
      this.classList.toggle("active");
      let panel = this.nextElementSibling;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  };
  // Check whether there is crew or not in a launch
  let checkCrew = (object) => {
    if (object.length > 0) {
      console.log("has crew");
    } else {
      console.log("No crew");
    }
  };
  // Load payload object
  async function loadPayload(array, container) {
    const payloadListTemplate = container.querySelector(".payload-list-items");
    const payloadListContainer = container.querySelector(
      ".payload-list-wrapper"
    );
    payloadListContainer.innerHTML = "";
    // Loop through each payload ID in Payload object
    for (let item of array) {
      // Store object value of promise
      let el = await fetchPayload(item);
      let payloadNumber = array.indexOf(item);
      console.log(payloadNumber);
      let payLoad = new Payload(
        el.type,
        el.customers,
        el.nationalities,
        el.mass_kg,
        el.manufacturers
      );
      payLoad.renderPayload(
        payloadListContainer,
        payloadListTemplate,
        payloadNumber
      );
    }
  }
  // Load crewObject
  async function loadCrew(array, container) {
    const sectionContainer = container.querySelector(".crew-list-wrapper");
    // Loop through each crew ID in Payload object
    for (let item of array) {
      // Store object value of promise
      let el = await fetchCrew(item);
      let crewMember = new Crew(
        el.name,
        el.status,
        el.agency,
        el.image,
        el.wikipedia
      );
      crewMember.renderCrew(sectionContainer);
    }
  }
  // Create crew objects and methods
  class Crew {
    constructor(name, status, agency, image, wikipedia) {
      this.name = name;
      this.status = status;
      this.agency = agency;
      this.image = image;
      this.wikipedia = wikipedia;
    }
    renderCrew(container) {
      // Show crew container
      container.classList.remove("hidden");
      let listItem = container.querySelector(".clone-item");
      let cloneItem = listItem.cloneNode(true);
      let img = cloneItem.querySelector("img");
      let link = cloneItem.querySelector("a");
      let nameLabel = cloneItem.querySelector(".crew-name");
      let crewAgency = cloneItem.querySelector(".crew-agency");

      cloneItem.classList.remove("hidden");
      link.href = this.wikipedia;
      img.src = this.image;
      crewAgency.innerHTML = this.agency;
      nameLabel.innerHTML = this.name;
      container.append(cloneItem);
    }
  }
  // To do add payload items
  class Payload {
    constructor(type, customers, nationalities, mass_kg, manufacturers) {
      this.type = type;
      this.customers = customers;
      this.nationalities = nationalities;
      this.mass_kg = mass_kg;
      this.manufacturers = manufacturers;
    }
    renderPayload(container, listTemplate, index) {
      let listClone = listTemplate.cloneNode(true);
      let payLoadType = listClone.querySelector(".payload-type");
      let customerType = listClone.querySelector(".customer-type");
      let manufacturerType = listClone.querySelector(".manufacturer-type");
      let nationalityType = listClone.querySelector(".nationality-type");
      let weightType = listClone.querySelector(".weight-type");
      let capsuleNumber = listClone.querySelector(".capsule-number");
      let button = listClone.querySelector("button");

      // Add new payload list item
      container.append(listClone);
      listClone.classList.remove("hidden");
      // Populate payload details
      capsuleNumber.innerHTML = index + 1;
      payLoadType.innerHTML = this.type;
      customerType.innerHTML = this.customers;
      manufacturerType.innerHTML = this.manufacturers;
      nationalityType.innerHTML = this.nationalities;
      weightType.innerHTML = this.mass_kg + "kg";

      accordionInteraction(button);
    }
  }
  goHome();
  searchBar();
  loadLaunchList(setChecked);
  onSelectRenderArray();
});
