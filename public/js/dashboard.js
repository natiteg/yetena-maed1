const blogSection = document.querySelector('.blogs-section');
let ui = new firebaseui.auth.AuthUI(auth);
let login = document.querySelector('.login');

auth.onAuthStateChanged((user) => {
    if(user){
        login.style.display = 'none';
        getUserWrittenBlogs(); // Added to fetch and display blogs when the user is authenticated.
    }else{
        setupLoginButton();

    }
})

const setupLoginButton = () => {
    ui.start("#loginUI", {
        callbacks: {
            signInSuccessWithAuthResult: function(authResult, redirectURL){
                login.style.display = 'none';
                console.log("User signed in successfully.");
                return false;
            }
        },
        signInFlow: "popup",
        signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID]
    })
}


const getUserWrittenBlogs = () => {
    console.log("Fetching blogs...");
    db.collection("blogs").where("author", "==", auth.currentUser.email.split("@")[0])
    .get()
    .then((blogs) => {
        console.log("Blogs fetched successfully.");

        blogs.forEach((blog) => {
            createBlog(blog);
        })
    })
    .catch((error) => {
        console.log("Error getting blogs");
    })
} 

const createBlog = (blog) => {
    let data = blog.data();
    if (data && data.title && data.article) {
    blogSection.innerHTML += `
    <div class="blog-card">
        <img src="${data.bannerImage}" class="blog-image" alt="">
        <h1 class="blog-title">${data.title.substring(0, 100) + '...'}</h1>
        <p class="blog-overview">${data.article.substring(0, 200) + '...'}</p>
        <div class="btn-container">
            <a href="/${blog.id}" class="btn dark">read</a>
            <a href="/${blog.id}/editor" class="btn grey">edit</a>
            <a href="#" onclick="deleteBlog('${blog.id}')" class="btn danger">delete</a>
        </div>


    </div>
    `;
}
}

const deleteBlog = (id) => {
    db.collection("blogs").doc(id).delete().then(() => {
        console.log("Blog deleted successfully.");

        location.reload();
    })
    .catch((error) => {
        console.log("Error deleting the blog");
    })
}