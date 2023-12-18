// const createImage = (url) =>
//   new Promise((resolve, reject) => {
//     const img = new Image();
//     img.addEventListener('load', () => resolve(img));
//     img.addEventListener('error', (error) => reject(error));
//     img.src = url;
//   });

// const getCroppedImg = async (imageSrc, crop) => {
//   const image = await createImage(imageSrc);
//   const canvas = document.createElement('canvas');
//   const scaleX = image.naturalWidth / image.width;
//   const scaleY = image.naturalHeight / image.height;
//   const width = Math.round(scaleX * crop.width);
//   const height = Math.round(scaleY * crop.height);
//   canvas.width = width;
//   canvas.height = height;
//   const ctx = canvas.getContext('2d');

//   ctx?.drawImage(
//     image,
//     crop.x * scaleX,
//     crop.y * scaleY,
//     crop.width * scaleX,
//     crop.height * scaleY,
//     0,
//     0,
//     width,
//     height
//   );

//   return new Promise((resolve, reject) => {
//     canvas.toBlob(
//       (blob) => {
//         if (!blob) {
//           reject(new Error('Canvas is empty'));
//           return;
//         }
//         const reader = new FileReader();
//         reader.readAsDataURL(blob);
//         reader.onloadend = () => {
//           const base64data = reader.result;
//           resolve(base64data);
//         };
//       },
//       'image/jpeg',
//       1
//     );
//   });
// };

// export default getCroppedImg;




const createImage = (url:string) : Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', (error) => reject(error));
    img.src = url;
  });

  interface Crop {
    x: number;
    y: number;
    width: number;
    height: number;
  }

const getCroppedImg = async (imageSrc:string, crop:Crop) => {
  const image : HTMLImageElement  = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  const width = Math.round(scaleX * crop.width);
  const height = Math.round(scaleY * crop.height);
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  ctx?.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    width,
    height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64data = reader.result;
          resolve(base64data);
        };
      },
      'image/jpeg',
      1
    );
  });
};

export default getCroppedImg;
