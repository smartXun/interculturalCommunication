const COS = require('cos-nodejs-sdk-v5');
const fs = require('fs')

const cos = new COS({
  AppId: '1255418131',
  SecretId: 'AKIDpUu63mTejaDblgEq9D2buxkHYZTAOpoZ',
  SecretKey: 'e4FCvPegT2MSKxLUO4VheLmxtZz93i7G',
});

cos.up = ( filename, path )=>{
  return new Promise(function (resolve, reject) {
    cos.sliceUploadFile({
      Bucket: 'crossculture',
      Region: 'ap-guangzhou',
      Key: filename,
      FilePath: path
    }, function (err, data) {
      fs.unlinkSync(path);
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

module.exports = cos