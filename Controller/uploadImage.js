const axios = require('axios');
 const { createClient } = require('@supabase/supabase-js');

 // Initialize Supabase client with your project's URL and anon/public key
 const supabaseUrl = 'https://cynlnxqqcyuxauxvxcjf.supabase.co';  // Replace with your Supabase URL
 const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5bmxueHFxY3l1eGF1eHZ4Y2pmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc4MDA4MTQsImV4cCI6MjA0MzM3NjgxNH0.0hzVuAKkvFRzNo1O4WzDw1wQTCxONIxIZTsg5t1oVac';  // Replace with your Supabase anon key
 const supabase = createClient(supabaseUrl, supabaseKey);




 function base64ToBlob(base64, mime) {
    const byteString = atob(base64.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mime });
  }

  function getImageUrl(path) {
    const { data, error } = supabase.storage
      .from('Images')
      .getPublicUrl(path);
  
    if (error) {
      console.error("Error getting public URL:", error.message);
      return;
    }
  
    console.log("Public URL:", data.publicUrl);
    return data.publicUrl;
  }
  

async function uploadBase64ImageController(req,res) {
    const mimeType = "image/png"; // Change according to the image type
    const imageBlob = base64ToBlob(req.body.contents, mimeType);
    console.log("hi");
    const { data, error } = await supabase.storage
      .from('Images') // Replace with your actual bucket name
      .upload(req.body.file_name, imageBlob, {
        upsert:true,
        contentType: mimeType,
        getPublicUrl:true,
      });
  
    if (error) {
      console.error("Error uploading image:", error.message);
      return;
    }
  
    console.log("Uploaded image data:", data);
    console.log(getImageUrl(data.path));
    publicUrl=getImageUrl(data.path);
    uploadImageToPrintful(publicUrl);
    return data; // You can return the data for further processing, like getting the URL
  };



  async function uploadImageToPrintful(imageUrl) {
    const apiKey = 'VLUOC2erat9bErXekeiQ3V2fmQ82vz6Vt3Htjv5o'; // Replace with your actual API key
    const url = 'https://api.printful.com/files?store_id=14505302'; // Printful API endpoint for file uploads
  
    try {
      // Set the headers for the request
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      };
  
      // Prepare the request body
      const body = {
        url: imageUrl, // Use the Supabase image URL
      };
  
      // Make the POST request to upload the image
      const response = await axios.post(url, body, { headers });
  
      // Check the response
      if (response.status === 200) {
        console.log('Image uploaded successfully:');
        console.log(response);
        return response.data; // You can return the response data as needed
      } else {
        console.error('Error uploading image:', response.data);
      }
    } catch (error) {
      console.error('Error uploading image to Printful:', error);
    }
  }
  
  

 module.exports=uploadBase64ImageController;