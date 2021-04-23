window.addEventListener('DOMContentLoaded', event => {
  let searchField = document.getElementById('search')
  let submitBtn = document.getElementById('submitBtn')
  let userList = document.getElementById('img-container')
  let sectionCrew = document.getElementById('space-crew')
  let sectionCta = document.querySelectorAll('.section-cta')
  let listTemplate = document.querySelector('.clone-list')
  let launchListSection = document.getElementById('launch-list')
  let sections = document.querySelectorAll('section')
  let detailsPage = document.getElementById('details-page')
  const resultsPage = document.getElementById('search-results');

  searchField.value = "";

  submitBtn.addEventListener("click", function (e) {

    e.preventDefault();

    let value = searchField.value.toLowerCase();
    console.log(value)

    let configurationObject = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        "query": {
          "$text": {
            "$search": value
          }
        }
      })
    };
    console.log(configurationObject)
    return fetch("https://api.spacexdata.com/v4/launches/query", configurationObject)
      .then(function (response) {
        return response.json();
      })
      .then(function (object) {
        console.log(object)
        renderSearch(object)



      })
      .catch(function (error) {
        console.log("Not working", error);
      });
  });


  // Fetch Payload of ID
  let fetchPayload = ((uid) => {
    return fetch(`https://api.spacexdata.com/v4/payloads/${uid}`)
      .then(function (response) {
        return response.json()
      })
      .then(function (object) {
       let payLoad = object  
       return payLoad
      })
      .then(function (payLoad) {
        return payLoad
      })
      .catch(function (error) {
          console.log(error)
      })
    
  })
  





let renderSearch = ((object) => {

  let sectionContainer = document.getElementById('search-results')
  let imgList = sectionContainer.querySelector('.img-container')
  let launches = object.docs

  // Check if there are launches 
  imgList.innerHTML = "";

  if (launches.length > 0) {

    sectionContainer.classList.remove("hidden");

    for (launch of launches) {

      let imgPath = shuffle(launch.links.flickr.original)
      let cloneList = listTemplate.cloneNode(true)
      cloneList.classList.remove('hidden')
      imgList.append(cloneList)
      let img = cloneList.querySelector('.img-tiles')
      let heading = cloneList.querySelector('.list-item-heading')
      let body = cloneList.querySelector('.list-item-description')
      let button = cloneList.querySelector('button')
      img.src = imgPath
      heading.innerText = `${launch.name}`
      let launchDetails = launch

      button.addEventListener('click', function (e) {
        console.log(launchDetails)
        togglePendingState()
        renderInfoPage(launchDetails)
      })
    }

  } else {
    console.log("empty")
  }
})
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
    const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
let loadSection = e => {
  let btn = e.target
  console.log(btn.id)
  if (btn.id === 'show-more-events') {
    launchListSection.classList.remove('hidden')
  } else {
  }
}

let clearPage = () => {
  for (let ctas of sectionCta) {
    ctas.addEventListener('click', e => {
      console.log(e.target)
      for (let section of sections) {
        section.classList.add('hidden')
      }
      setTimeout(function () {
        loadSection(e)
      }, 3000)
    })
  }
}
// Render List of Launches
let loadLaunchList = () => {
  let url = `https://api.spacexdata.com/v4/launches/past`
  return fetch(url)
    .then(function (response) {
      return response.json()
    })
    .then(function (object) {
      let sectionContainer = document.getElementById('launch-list')
      let imgList = sectionContainer.querySelector('.img-container')

      //Check if all objects have img srcs
      let launches = object.filter(el => {
        return el.links.flickr.original.length !== 0
      })

      // Shuffle launches so list is random each time
      let shuffleLaunches = shuffle(launches).slice(0, 24)

      // Render each list element with launch data
      for (launch of shuffleLaunches) {
        let imgPath = shuffle(launch.links.flickr.original)
        let cloneList = listTemplate.cloneNode(true)
        cloneList.classList.remove('hidden')
        imgList.append(cloneList)
        let img = cloneList.querySelector('.img-tiles')
        let heading = cloneList.querySelector('.list-item-heading')
        let body = cloneList.querySelector('.list-item-description')
        let button = cloneList.querySelector('button')


        if (launch.success === true) {
          button.classList.add("success")
        } else {
          button.classList.add("failure")
        }

        img.src = imgPath
        heading.innerText = `${launch.name}`
        // body.innerText = `${launch.details}`;
        let launchDetails = launch

        button.addEventListener('click', function (e) {
          let payload = fetchPayload(launchDetails.payloads[0])
          console.log(launchDetails)
          togglePendingState()
          renderInfoPage(launchDetails)
        })
      }
    })
    .catch(function (error) {
      console.log('Not working', error)
    })
}
let readableDates = date => {
  // US format
  let newDate = date.slice(0, 10)
  return newDate
}

// Function to toggle the pending state / loading bar
let togglePendingState = (() => {
  const slider = document.getElementById('slider')
  slider.classList.remove("hidden")
  setTimeout(function () {
    slider.classList.add("hidden");
  }, 3000)
})

let renderInfoPage = ((info, payload) => {

  // Clear search bar 
  searchField.value = "";

  // Hide/Show the correct section
  for (let section of sections) {
    if (section.id === 'details-page') {
      setTimeout(function () {
        section.classList.remove('hidden')
      }, 3000);
    } else {
      section.classList.add('hidden')
    }
  }
  
  //Check if launch was successful or failure = 
  const imgList = detailsPage.querySelector('.img-container')
  const heading = detailsPage.querySelector('h2')
  const summary = detailsPage.querySelector('p')
  const date = detailsPage.querySelector('.date')
  const flightNumber = detailsPage.querySelector('.status-indicator.number')
  const statusIndicator = detailsPage.querySelector('.status-indicator')
  const informationCard = detailsPage.querySelector('.information-card')
  const articleLink = informationCard.querySelector(".article-link a")
  const pressKitLInk = informationCard.querySelector(".presskit-link a")

  // Check if launch was successful or failure and apply correct styling
  if (info.success === true) {
    statusIndicator.innerHTML = "Success"
    statusIndicator.classList.remove("failure")
    flightNumber.classList.remove("failure")
    statusIndicator.classList.add("success")
    flightNumber.classList.add("success")
  } else {
    statusIndicator.innerHTML = "Failure"
    flightNumber.classList.remove("success")
    statusIndicator.classList.remove("success")
    statusIndicator.classList.add("failure")
    flightNumber.classList.add("failure")
  }

  // Populate Heading and Summary
  heading.innerText = `${info.name}`
  summary.innerText = `${info.details}`
  date.innerHTML = readableDates(`${info.date_local}`)
  flightNumber.innerHTML = `Flight #${info.flight_number}`

  // Populate Links
  articleLink.href = info.links.article
  pressKitLInk.href = info.links.presskit

  // Photos Array
  let photos = info.links.flickr.original

  // Populate photos 
  for (let photo of photos) {
    let img = document.createElement('img')
    img.src = photo
    imgList.append(img)
  }

})
loadLaunchList()
clearPage()
loadSection()
loadRandomLaunches()
})
