// Require the cloudinary library
const cloudinary = require('cloudinary').v2;

// Return "https" URLs by setting secure: true
cloudinary.config({
    secure: true
});

async function test() {
    await cloudinary.api.resources()
}

test();