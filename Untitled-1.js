        
        
        
        
        // // Detect customer selection, sorts the array based on selection and renders the array onto the DOM
        // let filterLaunches = ((originalArray) => {

        //   const radioGroup = document.getElementById("radio-filters")
        //   const radioButtonArray = radioGroup.querySelectorAll("input")
        //   const launches = originalArray
          
        //   // Sorts the array based on the selection and returns the array
        //   let createArray = ((a) => {

        //       for (let button of radioButtonArray) {

        //       button.addEventListener("click", function (e) {

        //         let selectedValue;
                
        //         if (button.checked) {
        
        //           selectedValue = button.value

        //             if (selectedValue === "Random") {
        //               console.log(selectedValue)

        //               let shuffle = shuffle(launches).slice(0, 24)
        //               return shuffle
        
        //             } else if (selectedValue === "Latest Launch") {
        
        //               let array = randomArray.sort()
        //               return array
        //             } else if (selectedValue === "Something else") {
        //               console.log(selectedValue)
        //             }
        //         } else {
        //           return false
        //         }
        //       })
        //     }
        //   })

        //   console.log(createArray(launches))


        //   // Renders the new array onto the DOM
        //   let renderList = ((launches) => {

        //     for (launch of launches) {

        //       let imgPath = shuffle(launch.links.flickr.original)
        //       let cloneList = listTemplate.cloneNode(true)
        //       cloneList.classList.remove('hidden')
        //       imgList.append(cloneList)
        //       let img = cloneList.querySelector('.img-tiles')
        //       let heading = cloneList.querySelector('.list-item-heading')
        //       let button = cloneList.querySelector('button')
  
  
        //       if (launch.success === true) {
        //         button.classList.add("success")
        //       } else {
        //         button.classList.add("failure")
        //       }
  
        //       img.src = imgPath
        //       heading.innerText = `${launch.name}`
        //       // body.innerText = `${launch.details}`;
        //       let launchDetails = launch
  
        //       button.addEventListener('click', function (e) {
        //         let payload = fetchPayload(launchDetails.payloads[0])
        //         console.log(launchDetails)
        //         togglePendingState()
        //         renderInfoPage(launchDetails)
        //       })
        //     }
        //     return array
        //   })

        //   return renderList(launches)
        
        // })
        // return filterLaunches(launches)