import React, { useState, useEffect } from "react";
import axios from "axios";
import "./BooksComponent.css";

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithRedirect, GoogleAuthProvider } from 'firebase/auth';

function BooksComponent() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState('');


  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [id, setId] = useState("");
  const [year, setYear] = useState("");

  const [authorFound, setAuthorFound] = useState("");
  const [authorF, setAuthorF] = useState("");
  const [buttonBool, setButtonBool] = useState(false);
  const [buttonBool2, setButtonBool2] = useState(false);

  const firebaseConfig = {
    apiKey: "AIzaSyCfndJ5pcN5lfzyyTxlT0WbyBCTV0ktncM",
    authDomain: "fir-test-58373.firebaseapp.com",
    projectId: "fir-test-58373",
    storageBucket: "fir-test-58373.appspot.com",
    messagingSenderId: "971121072370",
    appId: "1:971121072370:web:bdcdb9d48307b03f32586b",
    measurementId: "G-BK9B9VWGFK"
  };
  initializeApp(firebaseConfig);

	const signInWithGoogle = () => {
  	 const provider = new GoogleAuthProvider();
  	 const auth = getAuth();
  	 signInWithRedirect(auth, provider)
    	.then((result) => {
			
      		// User signed in
      		console.log(result.user);
    	}).catch((error) => {
      	// Handle Errors here.
      		console.error(error);
    	});
	};

	



  // function to call API to get all books in DB
  function displayAllBooks() {
    
    axios
      .get("https://springbookstore-404519.ue.r.appspot.com/findAllBooks")
      .then((response) => {
        setBooks(response.data); // Axios packs the response in a 'data' property
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }

  // function to handle the user submit of a new book
  // async used so we can use the "await", which causes a block until post is done
  //   and makes for a little simpler code (no .then)
  async function handleSubmit(event) {
    event.preventDefault();

    const postData = {
      title,
      author,
      year: parseInt(year, 10), // Convert string to integer
      userId
    };

    try {
      const response = await axios.post(
        "https://springbookstore-404519.ue.r.appspot.com/saveBook",
        postData
      );
      console.log("Response:", response.data);
      displayAllBooks();
    } catch (error) {
      console.error("Error posting data:", error);
    }
  }

  function displayByAuthor(event) {
    event.preventDefault();
    axios
      .get(`https://springbookstore-404519.ue.r.appspot.com/findByAuthor?author=${authorFound}`)
      .then((response) => {   
        setTitle(response.data[0].title)    
        setAuthor(response.data[0].author);
        console.log(response.data[0].author)

      })
      .catch((error) => {
       
      });
  }

  // useEffect makes it so list of books shown when this component mounts
  useEffect(() => {
    displayAllBooks();
    const auth = getAuth();
  const unsubscribe = auth.onAuthStateChanged(user => {
    if (user) {
      // User is signed in.
      console.log("User is signed in:", user);
      setUserId(user.uid);
    } else {
      // No user is signed in.
      console.log("No user is signed in.");
    }
  });
  return () => unsubscribe();    
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // this component displays a list of books and has a form for posting a new book
  return (
    <>
    {!userId && <button type="button" className="wofButton" onClick={signInWithGoogle}>Sign in with Google</button>}
    {userId && 
    <div className="book-list">


      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <br />
        <label>
          Author:
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </label>
        <br />

        <label>
          Year:
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
      <button type="button" onClick={() => {setButtonBool(true); setButtonBool2(false)}}>view all Books</button>
      <button type="button" onClick={() => {setButtonBool(false); setButtonBool2(true)}}>view your books</button>

      <form></form>

      {/* <form onSubmit={displayByAuthor}>
        <label>
          Enter Author Name to Search:
          <input
            type="text"
            value={authorFound}
            onChange={(e) => setAuthorFound(e.target.value)}
          />
        </label>
        <br />
        
        <button type="submit">Find</button>
        
        <div className="book-item">
          <h3>{title}</h3>
          <p>{author}</p>
        </div>
      </form> */}
      {buttonBool && books.map((book) => (      
        
        <div className="book-item">
          <h3>{book.title}</h3>
          <p>by {book.author}</p>
          <p> {book.userId}</p>
        </div>
      ))}
      {buttonBool2 && books.map((book) => (      
        book.userId === userId &&
        <div className="book-item">
          <h3>{book.title}</h3>
          <p>by {book.author}</p>
          <p> {book.userId}</p>
        </div>
      ))}

    </div>}
    </>
  );
}

export default BooksComponent;
