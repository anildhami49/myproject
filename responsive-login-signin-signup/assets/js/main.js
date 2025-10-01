/*===== LOGIN SHOW and HIDDEN =====*/
const signUp = document.getElementById('sign-up'),
    signIn = document.getElementById('sign-in'),
    loginIn = document.getElementById('login-in'),
    loginUp = document.getElementById('login-up')


signUp.addEventListener('click', ()=>{
    // Remove classes first if they exist
    loginIn.classList.remove('block')
    loginUp.classList.remove('none')

    // Add classes
    loginIn.classList.toggle('none')
    loginUp.classList.toggle('block')
})

signIn.addEventListener('click', ()=>{
    // Remove classes first if they exist
    loginIn.classList.remove('none')
    loginUp.classList.remove('block')

    // Add classes
    loginIn.classList.toggle('block')
    loginUp.classList.toggle('none')
})

// ===== SIGNUP FORM SUBMIT =====
document.getElementById('login-up').addEventListener('submit', async function(e) {
    e.preventDefault();

    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

  try {
    const response = await fetch('http://localhost:5000/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    const result = await response.json();
    if (response.ok) {
      // Save user info to localStorage
      localStorage.setItem('username', username);
      localStorage.setItem('email', email);
    }
    alert(result.message);
  } catch (error) {
    alert('Signup failed. Please try again.');
  }
});


document.getElementById('login-in').addEventListener('submit', async function(e) {
  e.preventDefault();

  const username = document.querySelector('#login-in input[placeholder="Username"]').value;
  const password = document.querySelector('#login-in input[placeholder="Password"]').value;

  try {
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const result = await response.json();
    if (response.ok) {
      // Save username to localStorage
      localStorage.setItem('username', username);
      // Fetch email from backend and save to localStorage
      try {
        const userInfoRes = await fetch(`http://localhost:5000/userinfo?username=${encodeURIComponent(username)}`);
        if (userInfoRes.ok) {
          const userInfo = await userInfoRes.json();
          if (userInfo.email) {
            localStorage.setItem('email', userInfo.email);
          }
        }
      } catch (err) {
        // Ignore error, email will remain blank
      }
      // Redirect to dashboard.html after successful login
      window.location.href = 'dashboard.html';
    } else {
      alert(result.message);
    }
  } catch (error) {
    alert('Login failed. Please try again.');
  }
});