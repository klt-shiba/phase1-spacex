window.addEventListener("DOMContentLoaded", (event) => {
  let searchField = document.getElementById("search-photos");
  let submitBtn = document.getElementById("submitBtn");
  let userList = document.getElementById("img-container");
  let sectionCrew = document.getElementById("space-crew");
  let sectionCta = document.querySelectorAll(".section-cta");
  console.log(sectionCta)
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
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  let loadRandomEvents = () => {
    let url = `https://api.spacexdata.com/v4/launches/past`;
    fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (object) {
        let successfulLaunches = object.filter((el) => {
          return el.static_fire_date_utc !== null;
        });
        let randomSix = shuffle(successfulLaunches).slice(0, 6);
        for (launch of randomSix) {
          let imgPath = launch.links.flickr.original;
          let button = document.createElement("button");
          let img = document.createElement("img");
          img.classList.add("img-tiles");
          button.classList.add("img-buttons");
          img.src = imgPath;
          userList.append(button);
          button.append(img);
          button.addEventListener("click", loadPage);
        }
      })
      .catch(function (error) {
        console.log("Not working", error);
      });
  }
  let loadCrew = () => {
    let url = "https://api.spacexdata.com/v4/dragons";
    
      fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (object) {
        console.log(object)
        let randomSix = shuffle(object).slice(0, 6);
        for (launch of randomSix) {
          let imgPath = launch.flickr_images[0];
          let button = document.createElement("button");
          let img = document.createElement("img");
          img.classList.add("img-tiles");
          button.classList.add("img-buttons");
          img.src = imgPath;
          sectionCrew.append(button);
          button.append(img);
          button.addEventListener("click", loadPage);
        }
      })
      .catch(function (error) {
        console.log("Not working", error);
      });
  }
  let loadPage = ((e) => {
    let btn = e;
    console.log(btn);
  })
  let clearPage = () => {
      for (let ctas of sectionCta) {
        ctas.addEventListener("click", (e) => {
        console.log(e.target)
        let sections = document.querySelectorAll("section");
        for (let section of sections) {
          section.classList.add("hidden");
        }
      })
    }
  }
  clearPage();
  loadCrew();
  loadPage();
  loadRandomEvents();
});


