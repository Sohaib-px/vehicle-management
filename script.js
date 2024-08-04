document.getElementById('register-btn').addEventListener('click', register);

async function register() {
    alert("Registration Successful!");
    console.log("Go to page1.html");

    const username = document.getElementById('username').value;
    const contact = document.getElementById('contact').value;

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, contact }),
        });

        if (response.ok) {
            window.location.href = 'page1.html';
        } else {
            console.error('Registration failed');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
document.querySelector('button').addEventListener('click', () => {
    fetch('https://example.com/vehicle-info')
        .then(response => response.json())
        .then(data => {
            document.querySelector('#vehicle-info').innerHTML = `
                <h3>Vehicle Info:</h3>
                <ul>
                    <li>Make: ${data.make}</li>
                    <li>Model: ${data.model}</li>
                    <li>Year: ${data.year}</li>
                    <li>Color: ${data.color}</li>
                </ul>
            `;
        })
        .catch(error => {
            console.error('Error fetching vehicle info:', error);
        });
});
