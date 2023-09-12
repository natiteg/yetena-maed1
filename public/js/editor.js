const blogTitleField = document.querySelector('.title');
const articleFeild = document.querySelector('.article');

// banner
const bannerImage = document.querySelector('#banner-upload');
const banner = document.querySelector(".banner");
let bannerPath;

const publishBtn = document.querySelector('.publish-btn');
const uploadInput = document.querySelector('#image-upload');

bannerImage.addEventListener('change', () => {
    uploadImage(bannerImage, "banner");
})

uploadInput.addEventListener('change', () => {
    uploadImage(uploadInput, "image");
})


// // Get the query parameter from the URL
// const urlParams = new URLSearchParams(window.location.search);
// const specificUserID = 'Aa1TmadYfIdNz37Rtko7uCelkRF3'; // Replace with the actual UID of the specific user

// // Check if the user parameter matches the specific user's UID
// if (urlParams.get('user') === specificUserID) {
//   // Allow access to the editor page for the specific user
//   location.replace('/editor');
// } else {
//   // Show an alert and prevent access for other users
//   alert('You do not have permission to access this page.');
//   // Redirect or take appropriate action to handle unauthorized access
//   // For example, you can redirect to a different page.
//  location.replace('/');
// }


const uploadImage = (uploadFile, uploadType) => {
    const [file] = uploadFile.files;
    if(file && file.type.includes("image")){
        const formdata = new FormData();
        formdata.append('image', file);

        fetch('/upload', {
            method: 'post',
            body: formdata
        }).then(res => res.json())
        .then(data => {
            if(uploadType == "image"){
                addImage(data, file.name);
            } else{
                bannerPath = `${location.origin}/${data}`;
                banner.style.backgroundImage = `url("${bannerPath}")`;
            }
        })
    } else{
        alert("upload Image only");
    }
}

const addImage = (imagepath, alt) => {
    let curPos = articleFeild.selectionStart;
    let textToInsert = `\r![${alt}](${imagepath})\r`;
    articleFeild.value = articleFeild.value.slice(0, curPos) + textToInsert + articleFeild.value.slice(curPos);
}

let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


publishBtn.addEventListener('click', () => {
    if(articleFeild.value.length && blogTitleField.value.length){
        
        let docName;
        if(blogID[0] == 'editor'){
        // generating id
                let letters = 'abcdefghijklmnopqrstuvwxyz';
                let blogTitle = blogTitleField.value.split(" ").join("-");
                let id = '';
                for(let i = 0; i < 4; i++){
                    id += letters[Math.floor(Math.random() * letters.length)];
                }
                let docName = `${blogTitle}-${id}`;
        } else {
            docName = decodeURI(blogID[0]);

        }

    
        // setting up docName
        let date = new Date(); // for published at info

         // Define an empty bannerPath initially
        //  let bannerPath = '';

         // Check if a banner image has been uploaded
        //  if (bannerImage.files.length > 0) {
        //     bannerPath = `${location.origin}/${bannerPath}`; // Corrected
        // }

        //access firstore with db variable;
        db.collection("blogs").doc(docName).set({
            title: blogTitleField.value,
            article: articleFeild.value,
            bannerImage: bannerPath,
            publishedAt: `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`,
            author: auth.currentUser.email.split("@")[0]
        })
        .then(() => {
            location.href = `/${docName}`;
        })
        .catch((err) => {
            console.error(err);
        })
    }
})

auth.onAuthStateChanged((user) => {
    if(!user){
        location.replace("/admin");
    }
})


let blogID = location.pathname.split("/");
blogID.shift();
if(blogID[0] != "editor"){
    let docRef = db.collection("blogs").doc(decodeURI(blogID[0]));
    docRef.get().then((doc) => {
        if(doc.exists){
            let data = doc.data();
            bannerPath = data.bannerImage;
            banner.style.backgroundImage = `url(${bannerPath})`;
            blogTitleField.value = data.title;
            articleFeild.value = data.article;
        }else{
            location.replace("/");
        }
    })
}