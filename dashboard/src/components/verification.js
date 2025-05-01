export async function validateToken() {
  try {
    const response = await fetch('http://localhost:4000/getToken', {
      method: 'GET',
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok || data.status !== true) {
      window.location.href = 'http://localhost:3000/login';
      return false;
    }

    return true;
  } catch (error) {
    console.error('Token validation error:', error);
    window.location.href = 'http://localhost:3000/login';
    return false;
  }
}
