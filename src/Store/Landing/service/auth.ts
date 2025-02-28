const URL = 'http://localhost:3005/api/v1/auth'

export async function loginUser(credentials: { email: string; password: string }) {

  const response = await fetch(URL+'/login', {

    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });

  const data = await response.json(); // Await parsing of the JSON response

  if (!response.ok) {
    //console.error(data);
    throw new Error(data.error?.message || 'Failed to login');
  }

  //console.log(data);
  return data;
}


export async function logoutUser(token:string) {

  const response = await fetch(URL+'/logout',{
    method: 'POST',
    headers: {
       'Authorization' : `Bearer ${token}`,
    }
  })
  const data = await response.json(); // Await parsing of the JSON response

  if (!response.ok) {
    //console.error(data);
    throw new Error(data.error?.message || 'Failed to logout');
  }

  return data;
  
}

export async function registerUser(params:{username: string; email: string; password: string}) {

  const response = await fetch(URL+'/register',{
    method:"POST",
    headers:{"Content-Type": "application/json"},
    body: JSON.stringify(params)
  });
  const data =  await response.json();
  return data
  if (! response.ok) {
    //console.error(data);
    throw new Error(data.error?.message );
  }
  
  
}