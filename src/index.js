window.addEventListener("DOMContentLoaded", (event) => {
  let searchField = document.getElementById("search-photos");
  let submitBtn = document.getElementById("submitBtn");
  let userList = document.getElementById("img-container");
  let sectionCrew = document.getElementById("space-crew");
  let sectionCta = document.querySelectorAll(".section-cta");
  let listTemplate = document.querySelector(".clone-list");
  let launchListSection = document.getElementById("launch-list");
  let sections = document.querySelectorAll("section");
  let detailsPage = document.getElementById("details-page");
  // submitBtn.addEventListener("click", function (e) {
  //   e.preventDefault();
  //   let value = searchField.value.toLowerCase();
  //   return fetch("https://api.spacexdata.com/v4/" + value)
  //     .then(function (response) {
  //       return response.json();
  //     })
  //     .then(function (object) {
  //       let successfulLaunches = object.filter((el) => {
  //         return el.static_fire_date_utc !== null;
  //       });
  //       let randomSix = shuffle(successfulLaunches).slice(0, 6);
  //       userList.innerHTML = "";
  //       for (launch of randomSix) {
  //         let imgPath = launch.image;
  //         let button = document.createElement("button");
  //         let img = document.createElement("img");
  //         img.classList.add("img-tiles");
  //         img.src = imgPath;
  //         sectionCrew.append(button);
  //         button.append(img);
  //       }
  //     })
  //     .catch(function (error) {
  //       console.log("Not working", error);
  //     });
  // });

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

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
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
  let loadLaunchList = () => {
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
        let shuffleLaunches = shuffle(launches)
        // Render each list element with launch data
        for (launch of shuffleLaunches) {
          let imgPath = shuffle(launch.links.flickr.original);
          let cloneList = listTemplate.cloneNode(true);
          cloneList.classList.remove("hidden");
          imgList.append(cloneList);
          let img = cloneList.querySelector(".img-tiles");
          let heading = cloneList.querySelector(".list-item-heading");
          let body = cloneList.querySelector(".list-item-description");
          let button = cloneList.querySelector("button");
          img.src = imgPath;
          heading.innerText = `${launch.name}`;
          // body.innerText = `${launch.details}`;
          let launchDetails = launch
          button.addEventListener("click", function(e) {
            console.log(launchDetails)
            renderInfoPage(launchDetails)
          });
        }
      })
      .catch(function (error) {
        console.log("Not working", error);
      });
  };
  let renderInfoPage = (info) => {
    for (let section of sections) {
      if (section.id === "details-page") {
        section.classList.remove("hidden");
      } else {
        section.classList.add("hidden");
      }
    }

    let imgList = detailsPage.querySelector(".img-container");
    let heading = detailsPage.querySelector("h2");
    let summary = detailsPage.querySelector("p");
    heading.innerText = `${info.name}`;
    summary.innerText = `${info.details}`;
    let photos = info.links.flickr.original
    for (let photo of photos) {
      let img = document.createElement("img") 
      img.src = photo
      imgList.append(img)
    }
  };

  loadLaunchList();
  clearPage();
  loadSection();
  loadRandomLaunches();
});
