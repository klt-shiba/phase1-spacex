window.addEventListener("DOMContentLoaded", (event) => {



  const imgUrl = "https://db.ygoprodeck.com/api/v7/cardinfo.php";
  const breedUrl = "https://db.ygoprodeck.com/api/v7/cardinfo.php";
  const dogImg = document.getElementById("dog-image-container");
  const elem = document.createElement("img");
  const listContainer = document.getElementById("dog-breeds");
  let list = document.createElement("li");
  let searchField = document.getElementById("search");
  let submitBtn = document.getElementById("submitBtn");
  let formSearch = document.getElementById("github-form");
  let userList = document.getElementById("img-container");
  let url = `https://api.spacexdata.com/v4/launches/past`;
  // submitBtn.addEventListener("click", function (e) {
  //   e.preventDefault();
  //   let formData = `?name=${searchField.value.toLowerCase()}`;
  //   return fetch(url)
  //     .then(function (response) {
  //       return response.json();
  //     })
  //     .then(function (object) {
  //       // object[0].login
  //       console.log(object);
  //       // In is for objects
  //       // Of is for array
  //       for (let user of object.data) {
  //         let img = document.createElement("img");
  //         img.src = user.card_images[0].image_url;
  //         userList.append(img);
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
    fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (object) {  
      
    let successfulLaunches = object.filter((el) => {
      return el.static_fire_date_utc !== null
    })
    let randomSix = shuffle(successfulLaunches).slice(0,50);

    console.log(randomSix)
    for (launch of randomSix) {
          let imgPath = launch.links.flickr.original
          let img = document.createElement("img");
          img.classList.add("img-tiles")
          img.src = imgPath;
          userList.append(img);
    } 
    })
    .catch(function (error) {
      console.log("Not working", error);
    });
  }
  loadRandomEvents();
});
