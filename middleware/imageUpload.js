const multer = require("multer");
const supabase = require("../supabase");

// store file in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// upload function to supabase
const uploadImageToSupabase = async (file, bucket) => {
    const fileName = `${Date.now()}_${file.originalname}`;

    const { error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file.buffer, {
            contentType: file.mimetype,
        });

    if (error) {
        console.error("Supabase image upload error:", error);
        throw new Error("Image upload failed");
    }

    // public URL
    const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/${bucket}/${fileName}`;

    return publicUrl;
};

module.exports = { upload, uploadImageToSupabase };
