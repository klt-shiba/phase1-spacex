window.addEventListener("DOMContentLoaded", (event) => {
  const searchField = document.getElementById("search");
  const submitBtn = document.getElementById("submitBtn");
  const sectionCta = document.querySelectorAll(".section-cta");
  const listTemplate = document.querySelector(".clone-list");
  const launchListSection = document.getElementById("launch-list");
  const sections = document.querySelectorAll("section");
  const detailsPage = document.getElementById("details-page");
  const resultsPage = document.getElementById("search-results");
  const radioGroup = document.getElementById("radio-filters");
  const radioButtonArray = radioGroup.querySelectorAll("input");
  let setChecked = (radioButtonArray[0].checked = true);
  searchField.value = "";

  let shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  let toggleSections = (s) => {
    // s = the section id
    togglePendingState();
    for (let section of sections) {
      console.log(section.id);
      if (section.id === s) {
        section.classList.remove("hidden");
      } else {
        section.classList.add("hidden");
      }
    }
  };
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
  let fetchLaunchSite = (uid) => {
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
  // let loadRandomLaunches = () => {

  //   let url = `https://api.spacexdata.com/v4/launches/past`;
  //   fetch(url)
  //     .then(function (response) {
  //       return response.json();
  //     })
  //     .then(function (object) {

  //       let sectionContainer = document.getElementById('launch-random');
  //       let imgList = sectionContainer.querySelector(".img-container")

  //       console.log(imgList)

  //       let launches = object.filter((el) => {
  //         return el.static_fire_date_utc !== null;
  //       });

  //       let randomSix = shuffle(launches).slice(0, 6);
  //       for (launch of randomSix) {
  //         let imgPath = launch.links.flickr.original;
  //         let button = document.createElement("button");
  //         let img = document.createElement("img");
  //         img.classList.add("img-tiles");
  //         button.classList.add("img-buttons");
  //         img.src = imgPath;
  //         imgList.append(button);
  //         button.append(img);
  //       }
  //     })
  //     .catch(function (error) {
  //       console.log("Not working", error);
  //     });
  // }
  let loadSection = (e) => {
    let btn = e.target;
    console.log(btn.id);
    if (btn.id === "show-more-events") {
      launchListSection.classList.remove("hidden");
    } else {
    }
  };
  let clearPage = () => {
    for (let ctas of sectionCta) {
      ctas.addEventListener("click", (e) => {
        console.log(e.target);
        for (let section of sections) {
          section.classList.add("hidden");
        }
        setTimeout(function () {
          loadSection(e);
        }, 3000);
      });
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
        imgList.innerHTML = "";
        //Check if all objects have img srcs
        let launches = object.filter((el) => {
          return el.links.flickr.original.length !== 0;
        });
        let sortArray = (a) => {
          const launchObject = a;

          // on page load order return array
          let decideSortType = () => {
            console.log(radioValue + "B");
            if (radioValue === radioButtonArray[0].checked) {
              let randomOrder = shuffle(launchObject).slice(0, 24);
              return randomOrder.slice(0, 10);
            } else if (radioValue === radioButtonArray[1].checked) {
              let flightNumber = launchObject.sort(
                (a, b) => a.flight_number - b.flight_number
              );
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
        // Shuffle launches so list is random each time
        let shuffleLaunches = shuffle(launches).slice(0, 24);

        return renderList(sortArray(launches), imgList);
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
          console.log("radioButtonArray[0].checked");
          let a = radioButtonArray[0].checked;
          return loadLaunchList(a);
        } else if (radioButtonArray[1].checked) {
          console.log("radioButtonArray[1].checked");
          let b = radioButtonArray[1].checked;
          return loadLaunchList(b);
        } else if (radioButtonArray[2].checked) {
          console.log("radioButtonArray[2].checked");
          let c = radioButtonArray[2].checked;
          return loadLaunchList(c);
        } else {
          return false;
        }
      });
    }
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

    // Hide/Show the correct section
    for (let section of sections) {
      if (section.id === "details-page") {
        setTimeout(function () {
          section.classList.remove("hidden");
        }, 3000);
      } else {
        section.classList.add("hidden");
      }
    }

    //Check if launch was successful or failure =
    const imgList = detailsPage.querySelector(".img-container");
    const heading = detailsPage.querySelector("h2");
    const summary = detailsPage.querySelector("p");
    const date = detailsPage.querySelector(".date");
    const flightNumber = detailsPage.querySelector(".status-indicator.number");
    const statusIndicator = detailsPage.querySelector(
      ".status-indicator.launch-success"
    );
    const informationCard = detailsPage.querySelector(".information-card");
    const articleLink = informationCard.querySelector(".article-link a");
    const pressKitLInk = informationCard.querySelector(".presskit-link a");
    const payloadListTemplate = informationCard.querySelector(
      ".payload-list-items"
    );

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

    // Photos Array
    let photos = info.links.flickr.original;

    // Populate photos
    for (let photo of photos) {
      let img = document.createElement("img");
      img.src = photo;
      imgList.append(img);
    }
    // Load payload object
    async function loadPayload() {
      const payloadListContainer = informationCard.querySelector(
        ".payload-list-wrapper"
      );
      // Loop through each payload ID in Payload object
      for (let item of payload) {
        // Store object value of promise
        let el = await fetchPayload(item);
        let listClone = payloadListTemplate.cloneNode(true);
        let payLoadType = listClone.querySelector(".payload-type");
        let customerType = listClone.querySelector(".customer-type");
        let manufacturerType = listClone.querySelector(".manufacturer-type");
        let nationalityType = listClone.querySelector(".nationality-type");
        let weightType = listClone.querySelector(".weight-type");
        let capsuleNumber = listClone.querySelector(".capsule-number");
        let button = listClone.querySelector("button");
        // Add new payload list item
        payloadListContainer.append(listClone);
        listClone.classList.remove("hidden");
        // Populate payload details
        console.log(el);
        capsuleNumber.innerHTML = payload.indexOf(item) + 1;
        payLoadType.innerHTML = el.type;
        customerType.innerHTML = el.customers;
        manufacturerType.innerHTML = el.manufacturers;
        nationalityType.innerHTML = el.nationalities;
        weightType.innerHTML = el.mass_kg + "kg";

        accordionInteraction(button);
      }
    }
    loadPayload();
  };
  // Render each list element with launch data
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
  searchBar();
  loadLaunchList(setChecked);
  onSelectRenderArray();
  clearPage();
  // loadSection();
});
