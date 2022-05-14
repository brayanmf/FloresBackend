const User = require("./user.model");
const ErrorHandler = require("../../utils/errorHandler");
const cloudinary = require("cloudinary").v2;

exports.findUser = async ({ id }) => {
  const user = await User.findById(id);
  if (!user) {
    return next(new ErrorHandler("Usuario no encontrado", 404));
  }
  return user;
};

exports.changeProfile = async ({ name, email }, { file }, { id }) => {
  console.log(name, email, file);
  const newUserData = {
    name,
    email,
  };

  if (file) {
    const user = await User.findById(id);
    const imgId = user.avatar.public_id;
    await cloudinary.uploader.destroy(imgId);
    const myCloud = await cloudinary.uploader.upload(file.path, {
      folder: "store/users",
      width: 150,
      crop: "scale",
    });
    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(id, newUserData, {
    new: true,
    runValidators: true,
  });
  return user;
};
