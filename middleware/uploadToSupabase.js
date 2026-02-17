const multer = require("multer");
const supabase = require("../supabase");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadFile = async (file, bucket) => {
    const fileName = `${Date.now()}-${file.originalname}`;

    const { error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file.buffer, {
            contentType: file.mimetype,
        });

    if (error) throw error;

    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);

    return data.publicUrl;
};

module.exports = { upload, uploadFile };
