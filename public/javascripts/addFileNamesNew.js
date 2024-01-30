var addCampgroundButton = document.getElementById("addCampground")
if (addCampgroundButton)
    addCampgroundButton.disabled = true

var editCampgroundButton = document.getElementById("editCampground")
if (editCampgroundButton)
    editCampgroundButton.disabled = false  

const currentImages = document.getElementById('currentImages')
if(currentImages){
    var currentImagesCount = countOccurrences(currentImages.value, 'https://res.cloudinary.com/');
}

var deleteImagesCheckboxes = document.getElementById('deleteImagesCheckboxes')
var checkboxesArray = []
if (deleteImagesCheckboxes){
    checkboxesArray = deleteImagesCheckboxes.querySelectorAll('input[type="checkbox"]')
}

var currentImagesChecked = [0, 0, 0]  

checkboxesArray.forEach(checkBox => {
    // console.log(checkBox, currentImagesCount, checkBox.id)
    checkBox.addEventListener('change', handleCheckboxChange)
})

function handleCheckboxChange() {
    let i = parseInt(this.id[6], 10)
    if (document.getElementById(`image-${i}`).checked)
        currentImagesChecked[i] = 1
    else
        currentImagesChecked[i] = 0
    // console.log(currentImagesChecked, currentImagesCount)
    previewMultipleEdit()
}

function previewMultiple(event) {
    // console.log('event triggered')
    var images = document.getElementById("image");
    var number = images.files.length;
    // console.log(images.files) 
    // console.log(event.target.files)
    var formFile = document.getElementById("formFile")
    var formFileMessage = document.getElementById("formFileMessage")
    formFile.innerHTML = ''
    

    for (i = 0; i < number; i++) {
        var urls = URL.createObjectURL(event.target.files[i]);
        formFile.innerHTML += '<img src="' + urls + '">';
    }
    if (number > 3){
        formFileMessage.innerHTML = 'Only 3 files can be selected, Please choose again'
        addCampgroundButton.disabled = true
    } else if (number === 0){
        formFileMessage.innerHTML = 'Must Select at least 1 image'
        addCampgroundButton.disabled = true
    } else {
        formFileMessage.innerHTML = ''
        addCampgroundButton.disabled = false
    }
    
}

function countOccurrences(mainString, substring) {
    let count = 0;
    let index = mainString.indexOf(substring);
  
    while (index !== -1) {
      count++;
      index = mainString.indexOf(substring, index + 1);
    }
  
    return count;
  }
  
  


function previewMultipleEdit(event=undefined) {
    // console.log('event triggered')
    
    var images = document.getElementById("image");
    var number = images.files.length;
    // console.log(images.files) 
    // console.log(currentImagesCount, number)
    var formFile = document.getElementById("formFile")
    var formFileMessage = document.getElementById("formFileMessage")
    formFile.innerHTML = ''
    
    if (event) {
        // console.log(event.target.files)
        for (i = 0; i < number; i++) {
            var urls = URL.createObjectURL(event.target.files[i]);
            formFile.innerHTML += '<img src="' + urls + '">';
        }
    }
    


    currentImagesCheckedCount = currentImagesChecked[0] + currentImagesChecked[1] + currentImagesChecked[2] 
    currentImagesCountDiff = currentImagesCount - currentImagesCheckedCount
    // console.log(currentImagesCountDiff, currentImagesCount, currentImagesCheckedCount, number, currentImagesChecked)
    if(currentImagesCountDiff === 3 && number > 0){
        formFileMessage.innerHTML = `No more images can be allowed, There are already 3 images, Delete some images to add more `
        editCampgroundButton.disabled = true
    } else if (number + currentImagesCountDiff > 3){
        formFileMessage.innerHTML = `Currently there are ${currentImagesCountDiff} images, Only ${3-currentImagesCountDiff} more images can be selected, Please choose again`
        editCampgroundButton.disabled = true
    } else if (number + currentImagesCountDiff === 0) {
        formFileMessage.innerHTML = 'You have selected to delete all images, either deselect some or upload more images'
        editCampgroundButton.disabled = true
    } else {
        formFileMessage.innerHTML = ''
        editCampgroundButton.disabled = false
    }

    
    
}