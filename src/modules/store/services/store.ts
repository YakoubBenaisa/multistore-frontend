

const URL = 'http://localhost:3005/api/v1/stores'

export async function create(params: { name: string; description: string }, userId: string) {
  const response = await fetch(URL+'/', {

    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      'Content-Type': 'application/json',
      'owner_id': userId,
    },
    body: JSON.stringify(params)
  });

  const data = await response.json(); // Await parsing of the JSON response

  if (!response.ok) {
    //console.error(data);
    throw new Error(data.error?.message || 'Failed to login');
  }

  //console.log(data);
  return data;
}
