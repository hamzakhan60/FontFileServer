const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with your project's URL and anon/public key
const supabaseUrl = 'https://cynlnxqqcyuxauxvxcjf.supabase.co';  // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5bmxueHFxY3l1eGF1eHZ4Y2pmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc4MDA4MTQsImV4cCI6MjA0MzM3NjgxNH0.0hzVuAKkvFRzNo1O4WzDw1wQTCxONIxIZTsg5t1oVac';  // Replace with your Supabase anon key
const supabase = createClient(supabaseUrl, supabaseKey);

// Node.js-compatible base64 to Blob conversion
function base64ToBlob(base64, mime) {
  const byteString = Buffer.from(base64.split(',')[1], 'base64');  // Decode using Buffer
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString[i];
  }
  return new Blob([ab], { type: mime });
}

// Get public URL of image from Supabase storage
function getImageUrl(path) {
  const { data, error } = supabase.storage
    .from('Images')
    .getPublicUrl(path);

  if (error) {
    console.error("Error getting public URL:", error.message);
    return null; // Return null in case of error
  }

  return data.publicUrl;
}

// Upload base64 image to Supabase and then to Printful
async function uploadBase64ImageController(req, res) {
  try {
    const mimeType = "image/png"; // Adjust according to the image type
    const imageBlob = base64ToBlob(req.body.contents, mimeType);

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from('Images')  // Replace with your actual bucket name
      .upload(req.body.file_name, imageBlob, {
        upsert: true,
        contentType: mimeType
      });

    if (error) {
      console.error("Error uploading image to Supabase:", error.message);
      return res.status(500).json({ error: "Image upload failed" });
    }

    // Get public URL of the uploaded image
    const publicUrl = getImageUrl(data.path);
    if (!publicUrl) {
      return res.status(500).json({ error: "Failed to get public image URL" });
    }

    // Upload image to Printful
    const printfulResponse = await uploadImageToPrintful(publicUrl);

    if (printfulResponse.error) {
      return res.status(500).json({ error: "Failed to upload image to Printful" });
    }

    // Respond with success and Printful's response
    return res.status(200).json({ message: "Image uploaded successfully", printfulResponse });
  } catch (err) {
    console.error("Error during the image upload process:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Function to upload image to Printful
async function uploadImageToPrintful(imageUrl) {
  const apiKey = 'VLUOC2erat9bErXekeiQ3V2fmQ82vz6Vt3Htjv5o'; // Replace with your actual API key
  const url = 'https://api.printful.com/files?store_id=14505302'; // Printful API endpoint for file uploads

  try {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    };

    const body = {
      url: imageUrl, // Use the Supabase image URL
    };

    const response = await axios.post(url, body, { headers });

    if (response.status === 200) {
      console.log('Image uploaded to Printful successfully');
      return response.data; // Return the response data
    } else {
      console.error('Error uploading image to Printful:', response.data);
      return { error: 'Failed to upload image to Printful' };
    }
  } catch (error) {
    console.error('Error during Printful image upload:', error.message);
    return { error: 'Printful upload error' };
  }
}

module.exports = uploadBase64ImageController;
