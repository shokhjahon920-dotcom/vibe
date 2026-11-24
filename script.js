const ADMIN_PASSWORD = "1234";

const STORAGE_KEY = "vibe_posts";


/* =========================
   ADMIN LOGIN
========================= */

function openLogin() {
  document.getElementById("loginModal").style.display = "flex";
}

function closeLogin() {
  document.getElementById("loginModal").style.display = "none";
}

function login() {

  const password = document.getElementById("password").value;
  const error = document.getElementById("loginError");

  if (password === ADMIN_PASSWORD) {

    closeLogin();

    document.getElementById("adminModal").style.display = "flex";

    document.getElementById("password").value = "";
    error.textContent = "";

  } else {

    error.textContent = "Wrong password.";

  }
}


function closeAdmin() {
  document.getElementById("adminModal").style.display = "none";
}


/* =========================
   LOAD SAVED POSTS
========================= */

document.addEventListener("DOMContentLoaded", function () {

  loadPosts();

});


/* =========================
   CREATE POST
========================= */

function addPost() {

  const fileInput = document.getElementById("imageFile");
  const captionInput = document.getElementById("caption");

  const caption = captionInput.value.trim();

  if (fileInput.files.length === 0 || caption === "") {

    alert("Please choose an image and write your thought.");

    return;
  }

  const file = fileInput.files[0];

  const reader = new FileReader();

  reader.onload = function (event) {

    const newPost = {

      id: Date.now(),

      image: event.target.result,

      caption: caption,

      likes: 0,

      date: new Date().toLocaleString()

    };


    /* GET OLD POSTS */

    const posts = getPosts();


    /* ADD NEW POST TO BEGINNING */

    posts.unshift(newPost);


    /* SAVE */

    savePosts(posts);


    /* SHOW POST */

    renderPost(newPost, true);


    /* CLEAR FORM */

    fileInput.value = "";
    captionInput.value = "";


    /* CLOSE ADMIN */

    closeAdmin();

  };

  reader.readAsDataURL(file);
}


/* =========================
   GET POSTS
========================= */

function getPosts() {

  const savedPosts = localStorage.getItem(STORAGE_KEY);

  if (!savedPosts) {

    return [];

  }

  return JSON.parse(savedPosts);

}


/* =========================
   SAVE POSTS
========================= */

function savePosts(posts) {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(posts)
  );

}


/* =========================
   LOAD POSTS
========================= */

function loadPosts() {

  const postsContainer = document.getElementById("posts");

  const savedPosts = getPosts();


  savedPosts.forEach(function (post) {

    renderPost(post, false);

  });

}


/* =========================
   RENDER POST
========================= */

function renderPost(post, addToTop) {

  const postsContainer = document.getElementById("posts");

  const article = document.createElement("article");

  article.className = "post";

  article.dataset.id = post.id;


  article.innerHTML = `

    <div class="post-image">

      <img
        src="${post.image}"
        alt="Vibe"
      >

    </div>


    <div class="post-body">

      <p class="post-text">
        ${escapeHTML(post.caption)}
      </p>


      <div class="post-footer">

        <span class="post-date">
          VIBE • ${post.date}
        </span>


        <button
          class="like-button"
          onclick="likePost(this)"
        >
          ♡ <span>${post.likes}</span>
        </button>

      </div>

    </div>

  `;


  if (addToTop) {

    postsContainer.prepend(article);

  } else {

    postsContainer.appendChild(article);

  }

}


/* =========================
   LIKE
========================= */

function likePost(button) {

  const article = button.closest(".post");

  const postId = Number(article.dataset.id);

  const number = button.querySelector("span");

  let likes = parseInt(number.textContent);


  if (button.classList.contains("liked")) {

    likes--;

    button.classList.remove("liked");

    button.firstChild.textContent = "♡ ";

  } else {

    likes++;

    button.classList.add("liked");

    button.firstChild.textContent = "♥ ";

  }


  number.textContent = likes;


  /* UPDATE STORAGE */

  const posts = getPosts();

  const post = posts.find(function (item) {

    return item.id === postId;

  });


  if (post) {

    post.likes = likes;

    savePosts(posts);

  }

}


/* =========================
   SECURITY
========================= */

function escapeHTML(text) {

  const div = document.createElement("div");

  div.textContent = text;

  return div.innerHTML;

}
