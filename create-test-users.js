// Simple script to create test users via edge function
// Run this in browser console or Node.js

const createTestUsers = async () => {
  try {
    const response = await fetch('https://ozckjosasowyorthaxus.supabase.co/functions/v1/create-test-users', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96Y2tqb3Nhc293eW9ydGhheHVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNTE2MDAsImV4cCI6MjA3MTcyNzYwMH0.I7pHIMr7iTBFRrc6mllNOPk0vPXVeZWYEm433T9TnRs',
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Test users created successfully:', result);
      return result;
    } else {
      const error = await response.text();
      console.error('Failed to create test users:', error);
      return { error };
    }
  } catch (error) {
    console.error('Error calling edge function:', error);
    return { error: error.message };
  }
};

// Call the function
createTestUsers().then(result => {
  console.log('Final result:', result);
});