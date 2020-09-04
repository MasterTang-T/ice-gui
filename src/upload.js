const {
  ipcRenderer
} = require('electron')
// 上传按钮
$('#upload-file-btn').on('click', function () {
  creatInputFile()
})

function creatInputFile() {
  let input = $(`<input type="file" accept='.ice'/>`)
  
  $(input).on('change', function (e) {
    let files = e.target.files || [];
    let path = files[0].path;
    let filename = files[0].name;
    console.log(path,filename)
    if (!path) {
      alert('请选择上传文件')
    }
    ipcRenderer.send("uploadFile", {
      path,
      filename
    })
  })
  input.click();
}
// 前端监听后台Node进程发过来的消息：
ipcRenderer.on('uploadFileSuccess', (event, arg) => {
  const {
    code,
    msg
  } = arg;
  if (code === 0) {
    alert('解析文件成功')
  }
});