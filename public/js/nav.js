let ul = document.querySelector('.links-container');
let button = document.querySelector('.btn');
let div = document.querySelector('.content')

auth.onAuthStateChanged((user) => {
    const specificUserID = 'Aa1TmadYfIdNz37Rtko7uCelkRF3'; // Replace with the actual UID of the specific user

    if (user) {
        ul.innerHTML += `
        <li class="link-item"><a href="/admin" class="link">Dashboard</a></li>
        <li class="link-item"><a href="#" onclick="logoutUser()" class="link">Logout</a></li>
    
        `
        if(user && user.uid === specificUserID){
        ul.innerHTML += `
        <li class="link-item"><a href="/editor" class="link">editor</a></li>
           `
           div.innerHTML += `
        <a href="/editor" class="btn">write a blog</a> `
        }
    }
    else{
        ul.innerHTML += `
        <li class="link-item"><a href="/admin" class="link">Login</a></li>
        `

}
})

