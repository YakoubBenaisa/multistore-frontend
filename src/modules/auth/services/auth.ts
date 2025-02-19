
export async function loginUser(credentials: { email: string; password: string }) {

  const response = await fetch('http://localhost:3005/api/v1/auth/login', {

    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });

  const data = await response.json(); // Await parsing of the JSON response

  if (!response.ok) {
    console.error(data);
    throw new Error(data.error?.message || 'Failed to login');
  }

  console.log(data);
  return data;
}
